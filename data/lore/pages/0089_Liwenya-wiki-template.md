---
page_id: 89
title: "Liwenya-wiki-template"
source_type: "FICTIONAL / WENYAVERSE"
mirror_url: "https://wiki.liwenya.com/Liwenya-wiki-template"
fandom_url: "https://wenyaverse.fandom.com/zh/wiki/Liwenya-wiki-template"
last_revid: 1149
last_revision_timestamp: "2026-08-08T22:07:33Z"
imported_from: "wiki.liwenya.com MediaWiki API; mirror/source derived from wenyaverse.fandom.com"
---

# Liwenya-wiki-template

## Source Notes

- 用途：Lore / Knowledge only，不作为 Voice Profile 语言证据。
- Fandom 原站当前环境连接超时；本页来自可稳定读取的 `wiki.liwenya.com` MediaWiki API。
- 来源属性为自动初筛，后续人工审阅时可调整。

## Categories

- 无

## Links

- [[XXX教授]]
- [[孙笑川教授]]
- [[文亚基础科学研究院]]
- [[李文亚]]

## Plain Text

复制以下内容到liwenya-wiki-template.txt<syntaxhighlight lang="markdown">
---
name: liwenya-wiki-template
description: 文亚宇宙世界观 Wiki 模板使用指导。提供 Character（人物）和 Institutions（机构）模板参数定义、页面推荐结构、编辑规则、命名规则及 AI Agent 工作流程。
---

# 文亚宇宙世界观 Wiki 模板使用指导

## Template:Character 人物模板

### 基本调用

```wiki

```

### 参数说明

| 参数 | 说明 |
|------|------|
| name | 人物名称 |
| image | 图片文件名（不填写 File:） |
| caption | 图片说明 |
| foreign_name | 外文名 |
| birth_date | 出生日期 |
| birth_place | 出生地 |
| occupation | 职业或身份 |
| affiliation | 所属机构 |
| position | 主要职务 |
| fields | 研究领域 |
| rival | 主要争议对象 |

### 示例

```wiki

```

---

## Template:Institutions 机构模板

### 基本调用

```wiki

```

### 参数说明

| 参数 | 说明 |
|------|------|
| name | 机构名称 |
| image | 机构图片或标志文件名 |
| caption | 图片说明 |
| director | 负责人 |
| location | 所在地 |
| established | 成立时间 |
| type | 机构类型 |
| fields | 研究领域 |
| evaluation | 外界评价 |

### 示例

```wiki

```

---

## 页面规范

### 人物页面推荐结构

```wiki

== 简介 ==

== 生平 ==

=== 早年经历（如果有） ===

=== 学术经历（如果有） ===

== 学术贡献（主要理论） ==

== 争议（如果有） ==

== 荣誉与影响（如果有） ==

== 评价 ==

== 相关条目 ==
```

### 机构页面推荐结构

```wiki

== 概要 ==

== 机构概况 ==

== 历史 ==

=== 创立 ===

=== 发展 ===

== 学术方向 ==

== 争议 ==

== 评价 ==

== 相关条目 ==
```

---

## 编辑规则

- 所有内容必须符合虚构世界观
- 不将虚构内容描述为现实事实
- 不创建现实人物对应条目
- 不使用真人照片，应使用 AI 生成图片
- 相关条目不要写入模板
- 创建页面后加入对应索引列表

---

## 命名规则

- 普通人物：XXX教授
- 特殊人物：李文亚（不添加教授后缀）

---

## AI Agent 工作流程

1. 判断条目类型：
   - 人物 → 使用 Character 模板
   - 机构 → 使用 Institutions 模板
2. 首先生成信息框模板
3. 再生成正文
4. 检查：
   - Wiki 语法
   - 内部链接
   - 分类
   - 世界观一致性
   - 是否有用户输入数据支撑或网络切实内容支撑，避免胡编乱造
5. 输出最终 MediaWiki 页面代码

</syntaxhighlight>

## Wikitext

```wikitext
复制以下内容到liwenya-wiki-template.txt<syntaxhighlight lang="markdown">
---
name: liwenya-wiki-template
description: 文亚宇宙世界观 Wiki 模板使用指导。提供 Character（人物）和 Institutions（机构）模板参数定义、页面推荐结构、编辑规则、命名规则及 AI Agent 工作流程。
---

# 文亚宇宙世界观 Wiki 模板使用指导

## Template:Character 人物模板

### 基本调用

```wiki
{| class="infobox"
|-
! colspan="2" style="text-align:center;" | {{PAGENAME}}
|-
! colspan="2" style="text-align:center;" | 基本信息
|-
| 外文名 || 
|-
| 出生日期 || 
|-
| 出生地 || 
|-
| 职业/身份 || 
|-
! colspan="2" style="text-align:center;" | 任职与研究
|-
| 所属机构 || 
|-
| 主要职务 || 
|-
| 研究领域 || 
|-
| 主要争议对象 || 
|}
```

### 参数说明

| 参数 | 说明 |
|------|------|
| name | 人物名称 |
| image | 图片文件名（不填写 File:） |
| caption | 图片说明 |
| foreign_name | 外文名 |
| birth_date | 出生日期 |
| birth_place | 出生地 |
| occupation | 职业或身份 |
| affiliation | 所属机构 |
| position | 主要职务 |
| fields | 研究领域 |
| rival | 主要争议对象 |

### 示例

```wiki
{| class="wikitable"
|-
! colspan="2" style="text-align:center;" | 林泽远教授
|-
| colspan="2" | [[File:Lin_Zeyuan.png|260px|center]]
|-
! colspan="2" style="text-align:center;" | 基本信息
|-
| 外文名 || 
|-
| 出生日期 || 
|-
| 出生地 || 
|-
| 职业/身份 || 理论物理学家
|-
! colspan="2" style="text-align:center;" | 任职与研究
|-
| 所属机构 || [[文亚基础科学研究院]]
|-
| 主要职务 || 高级研究员
|-
| 研究领域 || 复杂系统理论
|-
| 主要争议对象 || 
|}
```

---

## Template:Institutions 机构模板

### 基本调用

```wiki
{| class="wikitable"
|-
! colspan="2" style="text-align:center;" | {{PAGENAME}}
|-
! colspan="2" style="text-align:center;" | 基本信息
|-
| 外文名 || 
|-
| 机构类型 || 
|-
| 成立时间 || 
|-
| 创立者 || 
|-
| 负责人 || 
|-
| 所在地 || 
|-
| 研究领域 || 
|-
| 现状 || 
|-
| 首府 || 
|-
| 最大城市 || 
|-
| 官方语言 || 
|-
| 主要族群 || 
|-
| 人口 || 
|-
| 面积 || 
|-
! colspan="2" style="text-align:center;" | 组织信息
|-
| 人员规模 || 
|-
| 下属部门 || 
|-
| 所属体系 || 
|-
| 主要项目 || 
|-
| 代表成果 || 
|-
| 重要人物 || 
|-
| 负责人／统治者 || 
|-
! colspan="2" style="text-align:center;" | 历史与评价
|-
| 发展历程 || 
|-
| 主要争议 || 
|-
| 机构评价 || 
|-
| 主要对立方 || 
|}
```

### 参数说明

| 参数 | 说明 |
|------|------|
| name | 机构名称 |
| image | 机构图片或标志文件名 |
| caption | 图片说明 |
| director | 负责人 |
| location | 所在地 |
| established | 成立时间 |
| type | 机构类型 |
| fields | 研究领域 |
| evaluation | 外界评价 |

### 示例

```wiki
{| class="wikitable"
|-
! colspan="2" style="text-align:center;" | 114514研究所
|-
| colspan="2" | [[File:114514研究所标志.jpg|260px|center]]
|-
! colspan="2" style="text-align:center;" | 基本信息
|-
| 外文名 || 
|-
| 机构类型 || 综合科研机构
|-
| 成立时间 || 
|-
| 创立者 || 
|-
| 负责人 || [[孙笑川教授]]
|-
| 所在地 || 文亚共和国
|-
| 研究领域 || 材料科学、生物工程
|-
| 现状 || 
|-
| 首府 || 
|-
| 最大城市 || 
|-
| 官方语言 || 
|-
| 主要族群 || 
|-
| 人口 || 
|-
| 面积 || 
|-
! colspan="2" style="text-align:center;" | 组织信息
|-
| 人员规模 || 
|-
| 下属部门 || 
|-
| 所属体系 || 
|-
| 主要项目 || 
|-
| 代表成果 || 
|-
| 重要人物 || 
|-
| 负责人／统治者 || 
|-
! colspan="2" style="text-align:center;" | 历史与评价
|-
| 发展历程 || 
|-
| 主要争议 || 
|-
| 机构评价 || 存在学术争议
|-
| 主要对立方 || 
|}
```

---

## 页面规范

### 人物页面推荐结构

```wiki
{| class="wikitable"
|-
! colspan="2" style="text-align:center;" | {{PAGENAME}}
|-
! colspan="2" style="text-align:center;" | 基本信息
|-
| 外文名 || 
|-
| 出生日期 || 
|-
| 出生地 || 
|-
| 职业/身份 || 
|-
! colspan="2" style="text-align:center;" | 任职与研究
|-
| 所属机构 || 
|-
| 主要职务 || 
|-
| 研究领域 || 
|-
| 主要争议对象 || 
|}

== 简介 ==

== 生平 ==

=== 早年经历（如果有） ===

=== 学术经历（如果有） ===

== 学术贡献（主要理论） ==

== 争议（如果有） ==

== 荣誉与影响（如果有） ==

== 评价 ==

== 相关条目 ==
```

### 机构页面推荐结构

```wiki
{| class="wikitable"
|-
! colspan="2" style="text-align:center;" | {{PAGENAME}}
|-
! colspan="2" style="text-align:center;" | 基本信息
|-
| 外文名 || 
|-
| 机构类型 || 
|-
| 成立时间 || 
|-
| 创立者 || 
|-
| 负责人 || 
|-
| 所在地 || 
|-
| 研究领域 || 
|-
| 现状 || 
|-
| 首府 || 
|-
| 最大城市 || 
|-
| 官方语言 || 
|-
| 主要族群 || 
|-
| 人口 || 
|-
| 面积 || 
|-
! colspan="2" style="text-align:center;" | 组织信息
|-
| 人员规模 || 
|-
| 下属部门 || 
|-
| 所属体系 || 
|-
| 主要项目 || 
|-
| 代表成果 || 
|-
| 重要人物 || 
|-
| 负责人／统治者 || 
|-
! colspan="2" style="text-align:center;" | 历史与评价
|-
| 发展历程 || 
|-
| 主要争议 || 
|-
| 机构评价 || 
|-
| 主要对立方 || 
|}

== 概要 ==

== 机构概况 ==

== 历史 ==

=== 创立 ===

=== 发展 ===

== 学术方向 ==

== 争议 ==

== 评价 ==

== 相关条目 ==
```

---

## 编辑规则

- 所有内容必须符合虚构世界观
- 不将虚构内容描述为现实事实
- 不创建现实人物对应条目
- 不使用真人照片，应使用 AI 生成图片
- 相关条目不要写入模板
- 创建页面后加入对应索引列表

---

## 命名规则

- 普通人物：[[XXX教授]]
- 特殊人物：[[李文亚]]（不添加教授后缀）

---

## AI Agent 工作流程

1. 判断条目类型：
   - 人物 → 使用 Character 模板
   - 机构 → 使用 Institutions 模板
2. 首先生成信息框模板
3. 再生成正文
4. 检查：
   - Wiki 语法
   - 内部链接
   - 分类
   - 世界观一致性
   - 是否有用户输入数据支撑或网络切实内容支撑，避免胡编乱造
5. 输出最终 MediaWiki 页面代码

</syntaxhighlight>
```
