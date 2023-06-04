// Define date format options
const DATA_OPTIONS = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
};

const uiDataUrl = "data/tagmark_ui_data.jsonl";
const tagDefinitionsUrl = "data/tag_definitions.json";
const fitlerDocUrlTempl = "doc/filter.{language}.md";

const customizedHeaderFilterPlaceholder =
    "Press CTRL/CMD and click here for help...";

var tabulatorData = Array();
var tagDefinitions;
var tagsCount;
var maxTagCount;
var minTagCount;
var rainbow = new Rainbow();
var docs = {
    en: {
        filter: undefined,
    },
    zh_CN: {
        filter: undefined,
    },
    ja: {
        filter: undefined,
    },
};

// Fetch data from JSONL file and parse each line as a JSON object
function initData() {
    let fetchTabulatorDataPromise = fetch(uiDataUrl)
        .then((response) => response.text())
        .then((data) =>
            data
                .trim()
                .split("\n")
                .map((line) => {
                    let obj = JSON.parse(line);

                    obj.time_added = new Date(
                        obj.time_added * 1000
                    ).toLocaleString("zh-CN", DATA_OPTIONS);
                    if (obj.github_repo_info) {
                        obj.github_repo_info.time_created = new Date(
                            Date.parse(obj.github_repo_info.time_created)
                        ).toLocaleString("zh-CN", DATA_OPTIONS);
                        obj.github_repo_info.time_last_commit = new Date(
                            Date.parse(obj.github_repo_info.time_last_commit)
                        ).toLocaleString("zh-CN", DATA_OPTIONS);
                        obj.github_repo_info.time_last_release = new Date(
                            Date.parse(obj.github_repo_info.time_last_release)
                        ).toLocaleString("zh-CN", DATA_OPTIONS);

                        if (!obj.github_repo_info.is_archived) {
                            obj.github_repo_info.is_archived = false;
                        }
                        obj.github_repo_info.is_archived = obj.github_repo_info.is_archived.toString();
                    }

                    if (obj.is_github_url) {
                        if (!obj.github_repo_info.count_star) {
                            obj.github_repo_info.count_star = 0;
                        }
                        if (!obj.github_repo_info.count_fork) {
                            obj.github_repo_info.count_fork = 0;
                        }
                        if (!obj.github_repo_info.count_watcher) {
                            obj.github_repo_info.count_watcher = 0;
                        }
                    }

                    return obj;
                })
        );

    let fetchTagDefinitionsPromise = fetch(tagDefinitionsUrl).then((response) =>
        response.json()
    );

    return Promise.all([fetchTabulatorDataPromise, fetchTagDefinitionsPromise])
        .then((data) => {
            [tabulatorData, tagDefinitions] = data;
            tagsCount = tabulatorData.reduce((counts, item) => {
                item.tags.forEach((tag) => {
                    counts[tag] = (counts[tag] || 0) + 1;
                });
                return counts;
            }, {});
            maxTagCount = Math.max(...Object.values(tagsCount));
            minTagCount = Math.min(...Object.values(tagsCount));
            rainbow.setNumberRange(minTagCount, maxTagCount);
            rainbow.setSpectrum("Gainsboro", "Red");

            return;
        })
        .catch((error) => console.error(error.message));
}

function customHeaderFilter(headerValue, rowValue, rowData, filterParams) {
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    function filter(headerValue, cellValue) {
        if (!cellValue) return false;

        // case insensitive and trim
        let headerValueParts = headerValue.trim().split(/\b(OR|AND|NOT)\b/);
        let checkHeaderValueParts = Array();
        headerValueParts.forEach((headerValuePart) => {
            headerValuePart = headerValuePart.trim();
            if (headerValuePart === "AND") {
                checkHeaderValueParts.push("&&");
            } else if (headerValuePart === "OR") {
                checkHeaderValueParts.push("||");
            } else if (headerValuePart === "NOT") {
                checkHeaderValueParts.push("!");
            } else {
                let keyword = extractKeyword(headerValuePart);
                if (!keyword.trim()) return;
                if (Array.isArray(cellValue)) {
                    if (cellValue.length === 0) return false;
                    checkHeaderValueParts.push(
                        headerValuePart.replace(
                            keyword,
                            cellValue.some(
                                (elem) =>
                                    elem.trim().toLowerCase() ===
                                    keyword.toLowerCase().trim()
                            )
                        )
                    );
                } else if (typeof cellValue === "string") {
                    checkHeaderValueParts.push(
                        headerValuePart.replace(
                            keyword,
                            cellValue.trim().toLowerCase().includes(keyword)
                        )
                    );
                }
            }
        });
        let checkHeaderValueFuncCode =
            '"use strict"; return ' + checkHeaderValueParts.join(" ") + ";";
        let checkHeaderValueFunc = new Function(checkHeaderValueFuncCode);
        return checkHeaderValueFunc();
    }

    function extractKeyword(headerValuePart) {
        /*
         * This function takes a string inputStr as its argument and extracts the text between the
         * first opening parenthesis '(', and the last closing parenthesis ')' in the string. The
         * extracted text is then returned as the output of the function.
         */

        // Find the index of the first opening parenthesis
        let startIndex = 0;
        for (let i = 0; i < headerValuePart.length; i++) {
            if (headerValuePart[i] === "(") {
                startIndex = i + 1;
            } else {
                break;
            }
        }

        // Find the index of the last closing parenthesis
        let endIndex = headerValuePart.length;
        for (let i = headerValuePart.length - 1; i >= 0; i--) {
            if (headerValuePart[i] === ")") {
                endIndex = i;
            } else {
                break;
            }
        }

        // Extract the text between the parentheses
        const textBetweenParentheses = headerValuePart
            .substring(startIndex, endIndex)
            .trim();

        return textBetweenParentheses;
    }

    function getCellValue(rowData, filterParams) {
        let cellValue;
        if (filterParams.field.indexOf(".") === -1) {
            cellValue = rowData[filterParams.field];
        } else {
            filterParams.field.split(".").forEach((property) => {
                cellValue = cellValue ? cellValue[property] : rowData[property];
            });
        }
        return cellValue;
    }

    return filter(headerValue, getCellValue(rowData, filterParams));
}

// Create Tabulator table with parsed data and specified columns
function createTable() {
    //define column header menu as column visibility toggle
    var headerMenu = function () {
        function createMenuItem(column) {
            //create checkbox element using font awesome icons
            let icon = document.createElement("i");
            icon.classList.add("fas");

            //build label
            let label = document.createElement("span");
            let title = document.createElement("span");

            title.textContent = " " + column.getDefinition().title;

            label.appendChild(icon);
            label.appendChild(title);

            let subColumns = column.getSubColumns();
            let menuItem = {
                label: label,
                action: function (e) {
                    //prevent menu closing
                    e.stopPropagation();

                    //toggle current column visibility
                    column.toggle();

                    //change menu item icon
                    if (column.isVisible()) {
                        icon.classList.remove("fa-square");
                        icon.classList.add("fa-check-square");
                    } else {
                        icon.classList.remove("fa-check-square");
                        icon.classList.add("fa-square");
                    }
                },
            };

            // recursively add sub menu
            if (subColumns.length > 0) {
                icon.classList.add("fa-square-plus");

                menuItem.menu = Array();
                subColumns.forEach((subColumn) =>
                    menuItem.menu.push(createMenuItem(subColumn))
                );
            } else {
                icon.classList.add(
                    column.isVisible() ? "fa-check-square" : "fa-square"
                );
            }
            return menuItem;
        }

        var menu = [];
        this.getColumns(true).forEach((column) =>
            menu.push(createMenuItem(column))
        );
        return menu;
    };

    const columns = [
        {
            title: "No",
            frozen: true,
            headerHozAlign: "center",
            formatter: "rownum",
        },
        {
            title: "Title",
            field: "title",
            width: "20%",
            formatter: "textarea",
            frozen: true,
            headerHozAlign: "center",
            tooltip: true,
            headerFilter: "input",
            headerFilterPlaceholder: customizedHeaderFilterPlaceholder,
            headerFilterFunc: customHeaderFilter,
            headerFilterFuncParams: { field: "title" },
            headerFilterLiveFilter: false,
            headerMenu: headerMenu,
        },
        {
            title: "URL",
            field: "url",
            width: "15%",
            formatter: "textarea",
            cellClick: function (e, cell) {
                window.open(cell.getValue());
            },
            frozen: true,
            headerHozAlign: "center",
            tooltip: true,
            headerFilter: "input",
            headerFilterPlaceholder: customizedHeaderFilterPlaceholder,
            headerFilterFunc: customHeaderFilter,
            headerFilterFuncParams: { field: "url" },
            headerFilterLiveFilter: false,
            headerMenu: headerMenu,
        },
        {
            title: "Tags",
            field: "tags",
            width: "15%",
            headerHozAlign: "center",
            headerSort: false,
            titleFormatter: function (cell, formatterParams) {
                let title = cell.getValue();

                let allTagsShowSwitchContainer = document.createElement("span");
                allTagsShowSwitchContainer.id =
                    "all-tags-show-switch-container";
                let allTagsShowSwitch = document.createElement("i");
                allTagsShowSwitch.classList.add(
                    "fa-solid",
                    "fa-tags",
                    "fa-beat-fade"
                );
                allTagsShowSwitchContainer.appendChild(allTagsShowSwitch);

                // let allTagsShowSwitchHtml = `<span id="all-tags-show-switch-container"><i class="fa-solid fa-tags fa-beat"></i></span>`;

                return `${title} ${allTagsShowSwitchContainer.outerHTML}`;
            },
            headerFilter: "input",
            headerFilterPlaceholder: customizedHeaderFilterPlaceholder,
            headerFilterLiveFilter: false,
            headerFilterFunc: customHeaderFilter,
            headerFilterFuncParams: { field: "tags" },
            headerMenu: headerMenu,
            formatter: function (cell, formatterParams) {
                let tags = cell.getValue() || [];
                return addTags(tags);
            },
        },
        {
            title: "GitHub Info",
            headerHozAlign: "center",
            headerMenu: headerMenu,
            columns: [
                {
                    title: "Description",
                    field: "github_repo_info.description",
                    width: "20%",
                    formatter: "textarea",
                    headerHozAlign: "center",
                    tooltip: true,
                    headerFilter: "input",
                    headerSort: false,
                    headerFilterPlaceholder: customizedHeaderFilterPlaceholder,
                    headerFilterLiveFilter: false,
                    headerFilterFunc: customHeaderFilter,
                    headerFilterFuncParams: {
                        field: "github_repo_info.description",
                    },
                    headerMenu: headerMenu,
                },
                {
                    title: "Star",
                    field: "github_repo_info.count_star",
                    sorter: "number",
                    headerHozAlign: "center",
                    headerFilter: "input",
                    headerFilterPlaceholder: ">=",
                    headerFilterFunc: ">=",
                    headerFilterLiveFilter: false,
                    headerMenu: headerMenu,
                },
                {
                    title: "Fork",
                    field: "github_repo_info.count_fork",
                    sorter: "number",
                    headerHozAlign: "center",
                    headerFilter: "input",
                    headerFilterPlaceholder: ">=",
                    headerFilterFunc: ">=",
                    headerFilterLiveFilter: false,
                    headerMenu: headerMenu,
                },
                {
                    title: "Topics",
                    field: "github_repo_info.topics",
                    width: "20%",
                    formatter: "textarea",
                    headerHozAlign: "center",
                    headerFilter: "input",
                    headerSort: false,
                    headerFilterPlaceholder: customizedHeaderFilterPlaceholder,
                    headerFilterLiveFilter: false,
                    headerFilterFunc: customHeaderFilter,
                    headerFilterFuncParams: {
                        field: "github_repo_info.topics",
                    },
                    formatter: function (cell, formatterParams) {
                        let topics = cell.getValue() || [];
                        let topicDiv = document.createElement("div");
                        topicDiv.classList.add("topics-container");
                        topics.forEach((topic) => {
                            let topicSpan = document.createElement("span");
                            topicSpan.classList.add("topic-span");
                            topicSpan.style.backgroundColor = "LightSteelBlue";
                            topicSpan.innerText = `${topic}`;
                            topicDiv.appendChild(topicSpan);
                        });
                        return topicDiv;
                    },
                    headerMenu: headerMenu,
                },
                {
                    title: "Last Commit",
                    field: "github_repo_info.time_last_commit",
                    headerHozAlign: "center",
                    headerFilter: "input",
                    headerFilterPlaceholder: ">=",
                    headerFilterFunc: ">=",
                    headerFilterLiveFilter: false,
                    headerMenu: headerMenu,
                },
                {
                    title: "Created",
                    field: "github_repo_info.time_created",
                    headerHozAlign: "center",
                    headerFilter: "input",
                    headerFilterPlaceholder: ">=",
                    headerFilterFunc: ">=",
                    headerFilterLiveFilter: false,
                    headerMenu: headerMenu,
                },
                {
                    title: "Archived",
                    field: "github_repo_info.is_archived",
                    headerHozAlign: "center",
                    visible: false,
                    hozAlign: "center",
                    headerFilter: "input",
                    headerFilterPlaceholder: "=",
                    headerFilterFunc: "=",
                    headerFilterLiveFilter: false,
                    headerMenu: headerMenu,
                },
            ],
        },
        {
            title: "Date Added",
            field: "time_added",
            headerHozAlign: "center",
            headerFilter: "input",
            headerFilterPlaceholder: ">=",
            headerFilterFunc: ">=",
            headerFilterLiveFilter: false,
            headerMenu: headerMenu,
        },
        {
            title: "Comment",
            field: "comment",
            width: "20%",
            formatter: "textarea",
            headerHozAlign: "center",
            tooltip: true,
            headerFilter: "input",
            headerFilterPlaceholder: customizedHeaderFilterPlaceholder,
            headerFilterLiveFilter: false,
            headerFilterFunc: customHeaderFilter,
            headerFilterFuncParams: {
                field: "comment",
            },
            headerMenu: headerMenu,
        },
    ];

    return new Tabulator("#tagmark-table", {
        data: tabulatorData,
        columns: columns,
        layout: "fitDataFill",
        pagination: "local",
        // we can not set maxHeight to "90%", this will cause the header frozen not work
        // instead we should caculate the value then set to maxHeight
        maxHeight: `${0.9 * window.innerHeight}px`,
        pagination: true,
        paginationSize: 1000,
        paginationSizeSelector: [100, 1000, 10000, 100000],
    });
}

function showTagDefinition(event) {
    let tagDefinitionDiv = document.getElementById("tag-definition");

    // toggle display
    if (!["none", ""].includes(tagDefinitionDiv.style.display)) {
        tagDefinitionDiv.style.display = "none";
        return;
    }

    let tag = this.innerText;
    let tagCountSub = this.querySelector("sub");
    if (tagCountSub) {
        let regex = new RegExp(`${tagCountSub.innerText}+$`);
        tag = tag.replace(regex, "");
    }

    let tagDefinitionText = tagDefinitions[tag];
    if (!tagDefinitionText) {
        console.warn(
            `definition of tag "${tag}" is missing, please define it.`
        );
        tagDefinitionDiv.innerText = "[Warning] definition missing";
    } else {
        tagDefinitionDiv.innerText = tagDefinitionText;
    }

    let boundingRect = this.getBoundingClientRect();
    let windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
    let windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // set Y postion of tagDefinitionDiv
    if (boundingRect.top + boundingRect.height / 2 < windowHeight / 2) {
        tagDefinitionDiv.style.top = `${
            boundingRect.bottom + window.pageYOffset
        }px`;
        tagDefinitionDiv.style.bottom = "auto";
    } else {
        tagDefinitionDiv.style.top = "auto";
        tagDefinitionDiv.style.bottom = `${
            windowHeight - boundingRect.top + window.pageYOffset
        }px`;
    }

    // set X position of tagDefinitionDiv
    if (boundingRect.left + boundingRect.width / 2 < windowWidth / 2) {
        tagDefinitionDiv.style.left = `${
            (boundingRect.left + boundingRect.right) / 2 + window.pageXOffset
        }px`;
        tagDefinitionDiv.style.right = "auto";
    } else {
        tagDefinitionDiv.style.left = "auto";
        tagDefinitionDiv.style.right = `${
            windowWidth -
            (boundingRect.left + boundingRect.right) / 2 +
            window.pageXOffset
        }px`;
    }
    tagDefinitionDiv.style.display = "block";

    // check div top overflow and reset it
    tagDefinitionDivBoundingRect = tagDefinitionDiv.getBoundingClientRect();
    if (tagDefinitionDivBoundingRect.top < 0) {
        tagDefinitionDiv.style.top = `${window.pageYOffset}px`;
    }
    if (tagDefinitionDivBoundingRect.bottom > window.innerHeight) {
        tagDefinitionDiv.style.bottom = `${window.pageYOffset}px`;
    }
}

function startFadeTag(event) {
    this.style.cursor = "pointer";
    this.classList.toggle("fa-fade");
}

function stopFadeTag(event) {
    this.classList.toggle("fa-fade");
}

function addTagIntoHeaderFilter(event) {
    event.preventDefault();
    let tag = this.innerText;
    let tagCountSub = this.querySelector("sub");
    if (tagCountSub) {
        let regex = new RegExp(`${tagCountSub.innerText}+$`);
        tag = tag.replace(regex, "");
    }

    // here we can not use table.setHeaderFilterValue because it refresh the table automately, which is not we want
    //table.setHeaderFilterValue("tags", newTagsHeaderFilterValue);
    let tagsHeaderFilterInput = document.querySelector(
        '.tabulator-col[tabulator-field="tags"] input[type="text"]'
    );
    tagsHeaderFilterInput.value = tagsHeaderFilterInput.value
        ? `${tagsHeaderFilterInput.value} ${tag}`
        : tag;

    var interval = setInterval(function () {
        tagsHeaderFilterInput.classList.toggle("fa-fade");
    }, 500);

    setTimeout(function () {
        clearInterval(interval);
        tagsHeaderFilterInput.classList.remove("fa-fade");
    }, 3000);
}

function handleAllTagsShowSwitchContainerMouseover(event) {
    let allTagsShowSwitchTitle = document.getElementById(
        "all-tags-show-switch-container-title"
    );
    let boundingRect = this.getBoundingClientRect();
    allTagsShowSwitchTitle.style.top =
        boundingRect.bottom + window.pageYOffset + "px";
    allTagsShowSwitchTitle.style.left =
        (boundingRect.left + boundingRect.right) / 2 +
        window.pageXOffset +
        "px";

    allTagsShowSwitchTitle.style.display = "block";
}

function handleAllTagsShowSwitchContainerMouseout(event) {
    let allTagsShowSwitchTitle = document.getElementById(
        "all-tags-show-switch-container-title"
    );
    allTagsShowSwitchTitle.style.display = "none";
}

function addTags(tags, withCount = false, sort = "original") {
    let tagDiv = document.createElement("div");
    tagDiv.classList.add("tags-container");

    // Sort tags based on the sort parameter
    if (sort === "original") {
        // Do not modify the order, iterate in the original order
    } else if (sort === "name") {
        tags = tags.sort();
    } else if (sort === "count") {
        tags = tags.sort((a, b) => {
            if (tagsCount[b] !== tagsCount[a]) {
                // If count is not equal, sort by count value in descending order
                return tagsCount[b] - tagsCount[a];
            } else {
                // If count is equal, sort by element name in ascending order
                return a.localeCompare(b);
            }
        });
    }

    tags.forEach((tag) => {
        let count = tagsCount[tag];
        let tagSpan = document.createElement("span");

        tagSpan.classList.add("tag-span");
        tagSpan.style.backgroundColor = `#${rainbow.colorAt(count)}`;
        tagSpan.innerText = `${tag}`;
        tagSpan.title =
            "Left Click to show definition of this tag.\nRight Click to add this tag into the header filter input box.";
        if (withCount) {
            let tagCountSub = document.createElement("sub");
            tagSpan.appendChild(tagCountSub);
            tagCountSub.innerText = `${count}`;
        }

        // Change the font color to ensure it looks clear when the background color is deep
        if (count / maxTagCount >= 0.6) {
            tagSpan.style.color = "white";
        }
        tagDiv.appendChild(tagSpan);

        tagSpan.addEventListener("click", showTagDefinition);
        tagSpan.addEventListener("mouseover", startFadeTag);
        tagSpan.addEventListener("mouseout", stopFadeTag);
        tagSpan.addEventListener("contextmenu", addTagIntoHeaderFilter); // right click
    });
    return tagDiv;
}

function displayFilterDoc() {
    let filterDocLanguageSelect = document.getElementById(
        "filter-doc-language-select"
    );
    let filterDocDiv = document.getElementById("filter-doc");
    let language = filterDocLanguageSelect.value;
    let doc = docs[language].filter;

    if (!doc || !filterDocDiv.innerHTML) {
        let docUrl = fitlerDocUrlTempl.replace("{language}", language);
        fetch(docUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((markdown) => {
                docs[language].filter = markdown;
                filterDocDiv.innerHTML = marked.parse(markdown);
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    } else {
        filterDocDiv.innerHTML = marked.parse(doc);
    }
}

// Wait for DOM to load and then fetch and initialize data, create table, bind events
document.addEventListener("DOMContentLoaded", () => {
    initData()
        .then(() => {
            table = createTable();
            table.on("tableBuilt", function () {
                // set header filter value according to the url params
                let queryParams = new URLSearchParams(window.location.search);
                for (const [
                    filterFiled,
                    filterValue,
                ] of queryParams.entries()) {
                    this.setHeaderFilterValue(filterFiled, filterValue);
                }

                // set bookmark count
                let bookmarkCountSpan = document.getElementById(
                    "bookmark-count"
                );
                bookmarkCountSpan.innerText = tabulatorData.length;

                // add events
                let allTagsOverlay = document.getElementById(
                    "all-tags-overlay"
                );
                let allTagsShowSwitchContainer = document.getElementById(
                    "all-tags-show-switch-container"
                );
                let allTagsDiv = document.getElementById("all-tags-div");
                let allTagsOverlayCloseBtn = document.querySelector(
                    "#all-tags-overlay .close-btn"
                );
                let allTagsSortFiledset = document.getElementById(
                    "all-tags-sort-fieldset"
                );

                let filterDocOverlay = document.getElementById(
                    "filter-doc-overlay"
                );
                let filterDocOverlayCloseBtn = document.querySelector(
                    "#filter-doc-overlay .close-btn"
                );
                let allHeaderFilterInput = document.querySelectorAll(
                    ".tabulator-header-filter>input"
                );
                let filterDocLanguageSelect = document.getElementById(
                    "filter-doc-language-select"
                );

                allTagsShowSwitchContainer.addEventListener("click", () => {
                    allTagsOverlay.classList.toggle("active");
                });
                allTagsShowSwitchContainer.addEventListener(
                    "mouseover",
                    handleAllTagsShowSwitchContainerMouseover
                );
                allTagsShowSwitchContainer.addEventListener(
                    "mouseout",
                    handleAllTagsShowSwitchContainerMouseout
                );
                allTagsDiv.appendChild(
                    addTags(Object.keys(tagsCount), true, "count")
                );
                allTagsOverlayCloseBtn.addEventListener("click", () => {
                    allTagsOverlay.classList.remove("active");
                });
                allTagsSortFiledset.addEventListener("change", (event) => {
                    let sort = event.target.value;
                    allTagsDiv.innerHTML = "";
                    allTagsDiv.appendChild(
                        addTags(Object.keys(tagsCount), true, sort)
                    );
                });

                filterDocOverlayCloseBtn.addEventListener("click", () => {
                    filterDocOverlay.classList.remove("active");
                });
                allHeaderFilterInput.forEach((input) =>
                    input.addEventListener("mousedown", function (event) {
                        if (
                            // left button clicked and CTRL/COMMAND key pressed
                            event.button === 0 &&
                            (event.ctrlKey || event.metaKey)
                        ) {
                            event.preventDefault();
                            filterDocOverlay.classList.toggle("active");
                            displayFilterDoc();
                        }
                    })
                );
                filterDocLanguageSelect.addEventListener(
                    "change",
                    displayFilterDoc
                );
            });
        })
        .catch((error) => console.error(error.message));
});
