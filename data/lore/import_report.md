# Wiki Import Report

> 日期：2026-08-29
>
> 阶段：Lore / Knowledge 初次导入

## Source Check

- 用户提供的 Fandom URL：`https://wenyaverse.fandom.com/zh/wiki/文亚宇宙世界观_Wiki`
- 当前环境访问结果：Fandom 原站 API 与页面连接超时，无法稳定抓取正文。
- 可用替代源：`https://wiki.liwenya.com`
- 替代源说明：该站为可通过 MediaWiki API 读取的镜像；本次导入在 source map 中保留了 Fandom 推定 URL 与镜像 URL。

## Import Result

- 导入方式：`wiki.liwenya.com` MediaWiki API
- 命名空间：主命名空间 `ns=0`
- 词条数：185
- 失败词条：0
- 输出目录：`lore/wiki/pages/`
- 索引：`lore/wiki/index.md`
- 来源图：`lore/wiki/source_map.md`
- 机器可读记录：`lore/wiki/pages.json`
- 失败记录：`lore/wiki/import_failures.json`

## Source Type Auto-Pass

自动初筛结果：

- FICTIONAL / WENYAVERSE：106
- WIKI-DOCUMENTED：53
- DISPUTED：20
- SELF-REPORTED：4
- FAN-LORE：2

这些标签是初筛，不是最终判断。后续人工审阅时可以调整。

## Voice / Lore Boundary

- Wiki 只进入 Lore / Knowledge。
- Wiki 不得修改 `analysis/speech_profile.md`。
- Wiki 不得修改 `analysis/patterns.md`。
- Wiki 文风、百科句式、编辑者总结、网友二创不得成为 Voice 规则。
- Knowledge decides WHAT to say.
- Voice decides HOW to say it.
