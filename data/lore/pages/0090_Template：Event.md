---
page_id: 90
title: "Template：Event"
source_type: "WIKI-DOCUMENTED"
mirror_url: "https://wiki.liwenya.com/Template%EF%BC%9AEvent"
fandom_url: "https://wenyaverse.fandom.com/zh/wiki/Template%EF%BC%9AEvent"
last_revid: 160
last_revision_timestamp: "2026-07-26T00:50:17Z"
imported_from: "wiki.liwenya.com MediaWiki API; mirror/source derived from wenyaverse.fandom.com"
---

# Template：Event

## Source Notes

- 用途：Lore / Knowledge only，不作为 Voice Profile 语言证据。
- Fandom 原站当前环境连接超时；本页来自可稳定读取的 `wiki.liwenya.com` MediaWiki API。
- 来源属性为自动初筛，后续人工审阅时可调整。

## Categories

- 无

## Links

- 无

## Plain Text

<includeonly>
<table class="wikitable" style="float:right; width:300px; margin-left:10px; font-size:90%;">
<tr>
<th colspan="2" style="text-align:center; background-color:#2a2a2a; color:white;">{}</th>
</tr>
{{#if:{}|
<tr><td colspan="2" style="text-align:center;">{}</td></tr>
}}
{{#if:{}|
<tr><td colspan="2" style="text-align:center; font-size:85%;">{}</td></tr>
}}
{{#if:{}|
<tr><th>类型</th><td>{}</td></tr>
}}
{{#if:{}|
<tr><th>日期</th><td>{}</td></tr>
}}
{{#if:{}|
<tr><th>地点</th><td>{}</td></tr>
}}
{{#if:{}|
<tr><th>组织者</th><td>{}</td></tr>
}}
{{#if:{}|
<tr><th>结果</th><td>{}</td></tr>
}}
</table>
</includeonly>

## Wikitext

```wikitext
<includeonly>
<table class="wikitable" style="float:right; width:300px; margin-left:10px; font-size:90%;">
<tr>
<th colspan="2" style="text-align:center; background-color:#2a2a2a; color:white;">{{{name|事件}}}</th>
</tr>
{{#if:{{{image|}}}|
<tr><td colspan="2" style="text-align:center;">{{{image}}}</td></tr>
}}
{{#if:{{{caption|}}}|
<tr><td colspan="2" style="text-align:center; font-size:85%;">{{{caption}}}</td></tr>
}}
{{#if:{{{type|}}}|
<tr><th>类型</th><td>{{{type}}}</td></tr>
}}
{{#if:{{{date|}}}|
<tr><th>日期</th><td>{{{date}}}</td></tr>
}}
{{#if:{{{location|}}}|
<tr><th>地点</th><td>{{{location}}}</td></tr>
}}
{{#if:{{{organizer|}}}|
<tr><th>组织者</th><td>{{{organizer}}}</td></tr>
}}
{{#if:{{{outcome|}}}|
<tr><th>结果</th><td>{{{outcome}}}</td></tr>
}}
</table>
</includeonly>
```
