# TagMark UI

## What is TagMark

TagMark is a tag based browser bookmark solution for developers.

I have writien a blog [TagMark: Maybe a Better Browser Bookmark Solution](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/) to introduce TagMark in details with a toc below:

- [What is TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-tagmark)
- [What is a "browser bookmark solution"](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-a-browser-bookmark-solution)
- [Why we need tags for bookmarks](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#why-we-need-tags-for-bookmarks)
- [Why not Diigo bookmark manager (Diigo My Library)](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#why-not-diigo-bookmark-manager-diigo-my-library)
- [TagMark's solution: How to build your own TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#tagmarks-solution-how-to-build-your-own-tagmark)
- [Advanced usages](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#advanced-usages)

I recommend you read the blog first, to save time you can only read the [What is TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#what-is-tagmark) section and [TagMark's solution: How to build your own TagMark](https://pwnfan.github.io/post/en/TagMark-Maybe-a-Better-Browser-Bookmark-Solution/#tagmarks-solution-how-to-build-your-own-tagmark) section.

This repository `tagmark-ui` is a part of the TagMark solution, and this doc is also only for the `tagmark-ui` part.

## Setup and Usage

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
