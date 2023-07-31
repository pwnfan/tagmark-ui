# TagMark UI

- [TagMark UI](#tagmark-ui)
  - [Features And Demo](#features-and-demo)
  - [What is TagMark](#what-is-tagmark)
  - [Setup and Usage](#setup-and-usage)
  - [Using Filters Through URL GET Parameters](#using-filters-through-url-get-parameters)
  - [Acknowledgments](#acknowledgments)
  - [Known Issues](#known-issues)
  - [TODO](#todo)

## Features And Demo

Here is a page as the demo of TagMark usage, which is all my bookmarks integrated in my blog:

<https://www.pwn.fan/tagmark/>

Fetures of the page:

- Substantial tag based bookmarks
  - 2500+ tagged bookmarks, which contain contents below:
    - cybersecurity
      - red team
      - blue team
      - etc
    - software development, devops, devsecops
    - blogs of a person, enterprise, team or organization which refer to the above topics
    - etc
  - 1700+ curated Github Repos
  - 950+ tags with detailed tag definitions
- Full featured tags
  - tag definitions (show/hide definition by left click on tags)
  - tag overview with counts
  - color difference depending on counts
- Simple but powerful header filter for each column
  - thick client: static, pure frontend and js based, so it's fast responding
  - simple and useful fitler grammer
  - quickly input tag name into filter by just a right click
  - press CTRL/CMD with left click in any filter input to call out multiple language document (English/Japanese/Chinses)
- Supporting for URL GET paramaters based filtering
  - static, pure frontend and js based
  - easy for sharing
- Columns related things
  - detailed Github repository information
  - suppressible columns

see [the gif demos on my blog](https://www.pwn.fan/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-tagmark).

I'm glad to share all my bookmarks with you. Welcome to help me enhance this /tagmark page in my blog by:

- [Contributing and Sharing Your Great Bookmark(s)](https://github.com/pwnfan/pwnfan.github.io/issues/1#issue-1729293100)
- [Reporting Improper Tag Definitions](https://github.com/pwnfan/pwnfan.github.io/issues/2#issue-1729295366)
- [Reporting Improper Tag For Bookmarks](https://github.com/pwnfan/pwnfan.github.io/issues/3#issue-1729507987)

## What is TagMark

TagMark is a tag based browser bookmark solution for developers.

I have written a blog [TagMark: Maybe a Better Browser Bookmark Solution](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/) to introduce TagMark in details with a toc below:

- [What Is TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-tagmark)
- [What Is A "browser bookmark solution"](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-a-browser-bookmark-solution)
- [Why Do We Need Tags For Bookmarks](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#why-we-need-tags-for-bookmarks)
- [Why Not Diigo Bookmark Manager (Diigo My Library))](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#why-not-diigo-bookmark-manager-diigo-my-library)
- [TagMark's solution: How to build your own TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#tagmarks-solution-how-to-build-your-own-tagmark)
  - [Generating Your TagMark Data](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#generating-your-tagmark-data)
  - [Defining Your Tags With The Help Of ChatGPT](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#defining-your-tags-with-the-help-of-chatgpt)
  - [Periodically Upading Your TagMark Data and Tag Definitions](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#periodically-upading-your-tagmark-data-and-tag-definitions)
- [Advanced usages](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#advanced-usages)
- [FAQ](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#faq)

I recommend you read the blog first, to save time you can only read the [What is TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-tagmark) section and [TagMark's solution: How to build your own TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#tagmarks-solution-how-to-build-your-own-tagmark) section.

This repository `tagmark-ui` is a part of the TagMark solution, and this doc is also only for the `tagmark-ui` part.

## Setup and Usage

Dir structure:

```bash
├── CHANGELOG.md
├── LICENSE
├── README.md
├── css
│   └── tagmark.css
├── data
│   ├── tag_definitions.json    # all of my(@pwnfan) tag definitions, to share with you all, not a sample data
│   └── tagmark_ui_data.jsonl   # sample tagmark data, you can create your own data by tagmark(python) and replace this one
├── doc                         # filter docs
│   ├── filter.en.md
│   ├── filter.ja.md
│   └── filter.zh_CN.md
├── index.html
└── js
    └── tagmark.js
```

**Step 1 (Optiontal)**

Put the output file of [tagmark](https://github.com/pwnfan/tagmark)(python)(default: tagmark_ui_data.jsonl) into `tagmark-ui/data` and overwrite the the old one.

You can refer to the [TagMark's solution: How to build your own TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#tagmarks-solution-how-to-build-your-own-tagmark) section in my blog for details.

this step is optional, if you skip it then [the default sample data](./data/tagmark_ui_data.jsonl) with 3 rows will be shown.

**Step 2**

Serve this repo onto your web server. All features of tagmark-ui are implemented in pure frontend, so they are all static files.

Here is an exmaple of serving the web page locally using Python 3:

go to  `tagmark-ui/` and run a simple HTTP server in Python 3:

```bash
(py311) ➜  tagmark-ui git:(main) ✗ python -m http.server -b 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

open <http://localhost:8000/> and the UI will be shown.

_Note: you must access http://localhost:8000 instead of http://127.0.0.1:8000 because the remote font-awesome library used in tagmark-ui only allows cors request from domain "localhost" but banned "127.0.0.1"_

## Using Filters Through URL GET Parameters

tagmark-ui has implemented the invocation of filters through pure frontend Javascript. Please refer to the [filter docs](./doc/filter.en.md) for details.

## Acknowledgments

- [Tabulator](https://github.com/olifolkerd/tabulator)
- [RainbowVis-JS](https://github.com/anomal/RainbowVis-JS)
- [marked](https://github.com/markedjs/marked)
- [fontawesome](https://fontawesome.com/)
- [busuanzi](http://ibruce.info/2015/04/04/busuanzi)

## Known Issues

- #1 the checkbox icon in the column toggle menu dose not change in real time

## TODO

- [x] fix overlay doc `<a>` style
- [x] implement NOT keyword in the filter
- [ ] rewrite UI code with a popular frontend framework
- [ ] add right click menu into tabulator row to copy the json data of the row 
