# tagmark-ui

[![Notify Updates To my-tagmarks](https://github.com/pwnfan/tagmark-ui/actions/workflows/notify-updates.yml/badge.svg)](https://github.com/pwnfan/tagmark-ui/actions/workflows/notify-updates.yml)
[![Twitter Follow](https://img.shields.io/twitter/follow/pwnfan?label=follow)](https://twitter.com/intent/follow?screen_name=pwnfan)
[![Twitter URL](https://img.shields.io/twitter/url?url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Ftext%3Dhttps%3A%2F%2Fgithub.com%2Fpwnfan%2Ftagmark-ui)](https://twitter.com/intent/tweet?text=https://github.com/pwnfan/tagmark-ui) 

- [1. Introduction, User Guide and the Demo Page](#1-introduction-user-guide-and-the-demo-page)
- [2. Why TagMark?](#2-why-tagmark)
- [3. TagMark Related Projects](#3-tagmark-related-projects)
- [4. TagMark Architecture, Workflow and Customizing Guide](#4-tagmark-architecture-workflow-and-customizing-guide)
- [5. tagmark-ui User Guide](#5-tagmark-ui-user-guide)
  - [5.1. Setup and Usage](#51-setup-and-usage)
    - [5.1.1. Step 1 (optional)](#511-step-1-optional)
    - [5.1.2. Step 2](#512-step-2)
  - [5.2. Using Filters Through URL GET Parameters](#52-using-filters-through-url-get-parameters)
  - [5.3. Credits](#53-credits)
  - [5.4. Known Issues](#54-known-issues)
  - [5.5. TODO](#55-todo)

## 1. Introduction, User Guide and the Demo Page

TagMark is a tag-based bookmark solution I created for:

* Those who have a multitude of bookmarks and want to efficiently organize, easily retrieve, and share them with others.
* Individuals who frequently work with GitHub, have starred numerous repositories, yet struggle with how to efficiently retrieve and effectively utilize this vast amount of information.

Watch this video `TagMark - Introduction and User Guide` for details: 

[![TagMark - Introduction and User Guide](https://img.youtube.com/vi/0F5bkU90Tmc/0.jpg)](https://youtu.be/0F5bkU90Tmc)

Here is the demo page of TagMark, which collected all my bookmarks:

<https://pwnfan.github.io/my-tagmarks> / <https://tagmark.pwn.fan>

Features of the page:

* Substantial tag based bookmarks
  * 2700+ tagged bookmarks (1800+ curated Github Repos) mainly focus on cybersecurity and related development
  * 1000+ tags with detailed tag definitions
* Full featured tags
  * tag definitions (show / hide definition by left click on tags)
  * tag overview with counts
  * color difference depending on counts
* Simple but powerful header filter for each column
  * thick client: static, pure frontend and js based, so it's fast responding
  * simple and useful filter grammar
  * quickly input tag name into filter by just a right click
  * press CTRL/CMD with left click in any filter input to call out multiple language document (English / Japanese / Chinese)
* Supporting for URL GET parameters based filtering
  * static, pure frontend and js based
  * easy for sharing
* Columns related things
  * detailed Github repository information
  * suppressible columns
* Template Tag Doc

## 2. Why TagMark?

The introduction video summarized the reasons why I made TagMark, for the detailed reasons you can read my blog (`TL;DR 😅`)  [TagMark: Maybe a Better Browser Bookmark Solution](https://pwnfan.github.io/en/post/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/)

## 3. TagMark Related Projects

* [tagmark-py](https://github.com/pwnfan/tagmark-py)
  * exporting tagged bookmarked data from other third party services, e.g. diigo
  * converting other bookmark formats into Tagmark format, i.e `tagmarks.jsonl`
  * checking every tag has a been defined, i.e. checking tag consistency in `tagmarks.jsonl` and `tags.json`
  * getting tag definitions automatically with ChatGPT, i.e setting the values of the key `definition` in `tags.json`
  * making document from a template containing tag related syntaxes, i.e making `tag-doc.md`
* [tagmark-ui (this repo)](https://github.com/pwnfan/tagmark-ui)
  * a web page showing `tagmarks.jsonl`, `tags.json` and related docs
* [my-tagmarks](https://github.com/pwnfan/my-tagmarks)
  * my own bookmarks data stored as TagMark data `tagmarks.jsonl` and `tags.json`
  * a Github Pages repo serving `tagmark-ui` and showing all my bookmarks, i.e <https://pwnfan.github.io/my-tagmarks> / <https://tagmark.pwn.fan>
  * a Github README including curated topics (i.e. tags) from my personal bookmarks

## 4. TagMark Architecture, Workflow and Customizing Guide

If you want to customize your own `my-tagmarks`, here is a overview of TagMark architecture and workflow you need to get familiar with:

```text
     │                                                                         https://pwnfan.github.io/my-tagmarks    
   #0│   ╔═════════════╗          ╔═══════════════╗       ╔═════════════════╗  i.e. https://tagmark.pwn.fan            
   start ║  [original  ║          ║[exported data]║       ║  {tagmark-py}   ║                     ▲                    
     └──>║  bookmark   ║          ║               ║       ║   (this repo)   ║            #9 deploy│Github Pages        
         ║    data]    ║          ║ ░diigo░tool░░ ║       ║                 ║                     │                    
         ║             ║    ┌─────║>exported░data ║       ║   ████████████  ║  ┌──────────────────┼────────┐           
         ║ ░pwnfan's░░ ║    │     ║ ░░░(.html)░░░ ║ ┌──#2b.2──█subcommand█  ║  │         ╔════════════════╗│           
    ┌────║─░untagged░░ ║    │     ║               ║ │     ║   ███export███  ║  │         ║ {my-tagmarks}  ║│  #6.1     
    #1   ║ ░bookmarks░ ║    │     ║ ░░diigo░API░░ ║─┼──┐  ║   ████████████<─║──┼─┐       ║   ┌────────┐  ┌║┼──manually─
 manually║             ║    │     ║ ░dumped░data░<║─┘ #3.1║any              ║  │ │       ║   │tag-doc.│  │║│  make     
 set│tags╚═════════════╝    │     ║ ░░(.jsonl)░░░ ║   format  ████████████<─║──┘ │ ┌─#6.2║───│template│<─┘║│           
 and│add                  #2a.2   ╚═══════════════╝    └──║──>█subcommand█  ║    │ │     ║   └────────┘   ║│ #7.1      
   into                     │                             ║   ██convert███──║─┐  │ │     ║  ┌──────────┐  ║│update     
    │ ╔══════════════════╗  │    #3.2 add Github┌repo─────║───████████████  ║ │  │ │   ┌─║─>│tag-doc.md│  ║│Github     
    │ ║   {third-party   ║  │    info and covert│into     ║                 #7.2 │ │ #6.3║  └──────────┘  ║│ repo      
    │ ║bookmark & tagging║  │                   │         ║   ████████████  ║ │  │ │   │ ║   ┌────────┐   ║│ info      
    │ ║     service}     ║  │    ╔═════════════╗│ ┌──#4.1─║──>█subcommand█  ║ └──┼─┼───┼─║──>│tagmarks├───║everyday    
    │ ║                  ║  │    ║  [TagMark   ║│ │       ║   ██checktag██  ║    │ │ ┌─┼─║──>│ .json  │   ║            
    │ ║    ███diigo███   ║  │    ║    data]    ║│ │  ┌────║───████████████  ║    │ │ │ │ ║   └────────┘   ║            
    └─║───>██browser██   ║  │    ║             ║│ │ #4.2 add                ║    │ │ │ │ ║  ┌─────────┐   ║            
      ║    █extension█   ║  │  ┌─║──░░░░░░░░░<─║┘ │ missing   ████████████  ║    │ │┌┼─┼─║─>│tags.json│   ║            
      ║         │        ║  │ #3.3  ░TagMark░  ║  │ tags  ║   █subcommand█  ║    │ │││ │ ║  └─────────┘   ║            
      ║         │        ║  │  │ ║  bookmarks  ║  │  │    ║   █autotagdef█  ║    │ │││ │ ║  ┌──────────┐  ║            
      ║         ▼        ║  │  │ ║  (tagmarks  ║──┘  │ ┌#5.1─>████████████──║──┐ │ │││ │ ║  │tagmark-ui│  ║            
      ║    ███diigo███   ║  │  │ ║  ░.jsonl)░  ║     │ │  ║                 ║  │ │ │││ │ ║  └────▲─────┘  ║            
      ║    ██website██   ║  │  │ ║  ░░░░░░░░░  ║     │ │  ║   ████████████  ║  │ │ │││ │ ║       │        ║            
      ║         │        ║  │  │ ║             ║─────┼─┼#6.1─>█subcommand█<─║──┼─┼─┘││ │ ╚══════#8════════╝            
      ║         │  #2a.1 ║  │  │ ║ ░░░░░░░░░░░ ║     │ │  ║   █maketagdoc█──║──┼─┼──┼┼─┘         │                     
      ║         │ manually  │  │ ║ ░░TagMark░░<║─────┘ │  ║   ████████████  ║  │ │  ││  ╔═══════════════════╗          
      ║ ┌───────┴──run─on║  │┌─┼─║>░tags░info░─║───────┘  ╚═════════════════╝  │ │  ││  ║   {tagmark-ui}    ║          
      ║ │        diggo page ││ │ ║ (tags.json)<║─#5.2─define─tags─with─ChatGPT─┘ │  ││  ║ ┌──────────┐      ║          
      ║ │              │ ║  ││ │ ║ ░░░░░░░░░░░─║──────────#5.3───────────────────┼──┘│  ║ │filter doc├─┐    ║          
      ║ ▼              ▼ ║  ││ │ ║      │      ║                                 │   │  ║ │(EN/CN/JP)│ ├──┐ ║          
      ║ █diigo█ █diigo██ ║  ││ │ ╚═════════════╝                                 │   │  ║ └─┬────────┘ │  │ ║          
      ║ web█API █export█─║──┘│ │        │                                        │   │  ║   └──┬───────┘  │ ║          
      ║ ███████ ██tool██ ║   └─┼─────#4.3 manually set the values of keys        │   │  ║      └──────────┘ ║          
      ║   │              ║     │     `abbr/alias/full_name/gpt_prompt_context    │   │  ║  ┌─────────────┐  ║          
      ╚══════════════════╝     │     /prefer_format` for new added tags          │   │  ║  │Web Page Code│  ║          
          │                    │                                                 │   │  ║  └─────────────┘  ║          
          │                    └─────────────────────────────────────────────────┼───┘  ╚═══════════════════╝          
          └────────────────────────────#2b.1─respond─to──────────────────────────┘                                     
                                                                                                                       
                                                                                                                       
Steps Flow:                                                                                                            
              (option a)     ┌─>#3.1────>#3.2────>#3.3  ┌──>#5.1────>#5.2────>#5.3──┐  ┌─────────────┐                 
          ┌─>#2a.1──>#2a.2───┤                     │    │                       │   └─>│ #7.1───>7.2 │                 
      #1──┤                  │    ┌────────────────┘    │     ┌─────────────────┘      │             │                 
          └─>#2b.1──>#2b.2───┘    ▼                     │     ▼                     ┌─>│   #8   #9   │                 
              (option b)        #4.1────>#4.2────>#4.3──┘   #6.1────>#6.2────>#6.3──┘  └─────────────┘                 
                                               (suggested)  (------optional-------)                                     
```

Steps note and customizing suggestions:

* Steps requiring manual works
  * #1:
    * the first time involves a full workload of tagging all your bookmarks, which may take a considerable amount of time, but subsequent efforts only involve incremental tasks, which are much more easier
    * diigo related resources
      * [Chrome Extension: Diigo Web Collector * Capture and Annotate](https://chrome.google.com/webstore/detail/diigo-web-collector-captu/pnhplgjpclknigjpccbcnmicgcieojbh)
      * [Diigo Website](https://www.diigo.com/)
      * [Diigo Tools / Export](https://www.diigo.com/tools/export)
  * #2a.x
    * use alternative #2b is suggested
    * #2a.1 does't work well recently, may be due to some problems on the [Diigo Tools / Export](https://www.diigo.com/tools/export) service side，which impelled me to made an alternative #2b instead
    * notice that #2b exploits a web API of diigo and acts like a crawler to retrieve your own bookmarks, it's a trade-off option so we'd better not frequently use it, and I have added some sleep time between successive requests
    * Diigo has [its own official API](https://www.diigo.com/api_keys/new/) for retrieving bookmarks but it is a premium (paid) feature, may be it's a better option to become a premium user and add the related retrieving feature (plugin) into `tagmark-py` `export` subcommand
  * #4.3
    * optional but suggested if you want reading-friendly tag names and exact tag definitions shown in the web page (i.e. tagmark-ui)
    * similar to #1, the first time involves a full workload, which may take a considerable amount of time, but subsequent efforts only involve incremental tasks and are much more easier
  * #6.x
    * optional, if you don't need a TagMark tag doc, you can skip these steps
    * may take a considerable amount of time if you have many bookmarks and tags, and want to well categorize them into different topics, but fortunately this is just an one-off work
* #7, #8, and #9 form a unit in which the prerequisite dependencies are Steps #1 through #6. However, Steps #7, #8, and #9 are independent of each other and have no interdependencies
* Some steps are auto done by Github Actions, most of which are located in repo `my-tagmarks`
  * to ensure these actions function correctly, you may need to set repo `vars` and `secrets` which will be used in these actions
    * #6.2 and #6.3
      * [my-tagmarks/.github/workflows/update-tag-doc.yml](https://github.com/pwnfan/my-tagmarks/blob/main/.github/workflows/update-tag-doc.yml)
        * `${{ secrets.GH_PAT_TAGMARK }}`
    * #7:
      * [my-tagmarks/.github/workflows/update-tagmark-data.yml](https://github.com/pwnfan/my-tagmarks/blob/main/.github/workflows/update-tagmark-data.yml)
        * `${{ secrets.GH_PAT_TAGMARK }}`
        * `${{ vars.TAGMARK_DATA_EXPIRED_HOURS }}`
    * #8: trigger when `tagmark-ui` has new commit
      * [tagmark-ui/.github/workflows/github-page-update.yml](https://github.com/pwnfan/tagmark-ui/blob/main/.github/workflows/github-page-update.yml): used to notify repo `my-tagmarks` of the `tagmark-ui` code updates, if you do not need this feature, you can disable it and skip setting repo `vars` and `secrets`
        * `${{ secrets.GH_PAT_TAGMARK }}`
        * `${{ vars.GH_PAGES_REPO }}`
      * [my-tagmarks/.github/workflows/update-tagmark-ui.yml](https://github.com/pwnfan/my-tagmarks/blob/main/.github/workflows/update-tagmark-ui.yml): used to receive the notify from `tagmark-ui` and synchronize the `tagmark-ui` code into `my-tagmarks`, if you do not need this feature, you can disable it and skip setting repo `vars` and `secrets`
        * `${{ secrets.GH_PAT_TAGMARK }}`
        * `${{ env.TAGMARK_UI_DIR }}`
    * #9
      * [my-tagmarks/.github/workflows/github_pages.yml](https://github.com/pwnfan/my-tagmarks/blob/main/.github/workflows/github_pages.yml): no `vars` and `secrets` needed
  * so the repo `vars` and `secrets` need to set are
    * `${{ secrets.GH_PAT_TAGMARK }}`
      * it is a personal access tokens (aka PAT) having the `Contents(Read and Write access to code)` permission to the code of repo `my-tagmarks`
      * you need to set it in both `tagmark-ui` and `my-tagmarks` if you need the UI code synchronizing feature 
    * `${{ vars.TAGMARK_DATA_EXPIRED_HOURS }}`
      * it determines the expiring time of the Github repo info to a bookmark, see `tagmark-py` subcommand `covert` for details
      * the value I've set is `23`
      * only need to be set in repo `my-tagmarks`

## 5. tagmark-ui User Guide

### 5.1. Setup and Usage

Dir structure:

```bash
├── CHANGELOG.md
├── LICENSE
├── README.md
├── css
│   └── tagmark.css
├── data
│   ├── tags.json        # sample file, tags info
│   └── tagmarks.jsonl   # sample TagMark data, you can create your own data by tagmark-py and replace this one
├── doc                         # filter docs
│   ├── filter.en.md
│   ├── filter.ja.md
│   ├── filter.zh_CN.md
│   ├── tag-doc.md       # sample file, TagMark tag doc file, generate from `tag-doc.template` by `maketagdoc` subcommand of `tagmark-py` 
│   └── tag-doc.template # sample file, TagMark tag doc template
├── index.html
└── js
    └── tagmark.js
```

#### 5.1.1. Step 1 (optional)

Put the output file of [tagmark](https://github.com/pwnfan/tagmark)(python)(default: tagmark_ui_data.jsonl) into `tagmark-ui/data` and overwrite the the old one.

You can refer to the [TagMark's solution: How to build your own TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#tagmarks-solution-how-to-build-your-own-tagmark) section in my blog for details.

this step is optional, if you skip it then [the default sample data](./data/tagmark_ui_data.jsonl) with 3 rows will be shown.

#### 5.1.2. Step 2

Serve this repo onto your web server. All features of tagmark-ui are implemented in pure frontend, so they are all static files.

Here is an exmaple of serving the web page locally using Python 3:

go to  `tagmark-ui/` and run a simple HTTP server in Python 3:

```bash
vscode ➜ /workspaces/tagmark-py/tagmark-ui (main) $ python -m http.server -b localhost
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

or you can use the `make` command to run

```bash
vscode ➜ /workspaces/tagmark-py/tagmark-ui (main) $ make testserver
Loading TagMark UI Test Server......

python3 -m http.server 
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

open <http://localhost:8000/> and the UI will be shown.

_Note: you must access http://localhost:8000 instead of http://127.0.0.1:8000 because the remote font-awesome library used in tagmark-ui only allows cors request from domain "localhost" but banned "127.0.0.1"_

### 5.2. Using Filters Through URL GET Parameters

tagmark-ui has implemented the invocation of filters through pure frontend Javascript. Please refer to the [filter docs](./doc/filter.en.md) for details.

### 5.3. Credits

* [Tabulator](https://github.com/olifolkerd/tabulator)
* [RainbowVis-JS](https://github.com/anomal/RainbowVis-JS)
* [marked](https://github.com/markedjs/marked)
* [fontawesome](https://fontawesome.com/)
* [busuanzi](http://ibruce.info/2015/04/04/busuanzi)
* [sweetalert2](https://github.com/sweetalert2/sweetalert2)
* [string-format](https://github.com/davidchambers/string-format)

### 5.4. Known Issues

* #1 the checkbox icon in the column toggle menu dose not change in real time

### 5.5. TODO

* [x] fix overlay doc `<a>` style
* [x] implement NOT keyword in the filter
* [ ] rewrite UI code with a popular frontend framework
* [ ] add right click menu into tabulator row to copy the json data of the row 
