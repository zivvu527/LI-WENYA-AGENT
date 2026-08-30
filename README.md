# Li Wenya Agent

AI 李文亚角色对话项目。用户可以自行部署、填写自己的模型 API Key，然后在网页里和角色聊天。

这个项目不是李文亚本人，也不是事实百科助手。它是一个娱乐、戏仿和互联网文化保存性质的 AI 角色实验：用整理过的原始视频语料控制“怎么说”，用 Wiki / Lore 数据控制“知道什么”。

作者不提供公共 API Key，也不长期运营公共在线服务。谁部署，谁配置自己的 Key，谁承担模型调用费用。

## Features

- 在线聊天网页
- 本地 self-host 预览
- OpenAI-compatible 模型接口
- DeepSeek / OpenAI / 兼容服务可配置
- Corpus-grounded Voice Evidence
- 185 个 Wiki / Lore 页面
- Entity / Alias 检索
- Signature Layer
- Evidence Trace 调试面板

## Requirements

- Node.js 18 或更高版本
- 一个 OpenAI-compatible 模型 API Key

DeepSeek 可用，但建议先用非推理聊天模型跑通，例如：

```text
LI_WENYA_MODEL=deepseek-chat
```

## Quick Start

1. 下载或 clone 项目。

```bash
git clone <your-repo-url>
cd li-wenya-online
```

2. 复制环境变量示例。

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS / Linux:

```bash
cp .env.example .env
```

3. 编辑 `.env`，填入自己的 API Key。

```text
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.deepseek.com
LI_WENYA_MODEL=deepseek-chat
LI_WENYA_MAX_TOKENS=4000
LI_WENYA_TEMPERATURE=0.85
```

4. 启动。

```bash
npm start
```

5. 打开网页。

```text
http://127.0.0.1:8787
```

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | 用户自己的模型 API Key，不要提交到 GitHub |
| `OPENAI_BASE_URL` | yes | OpenAI-compatible API 地址 |
| `LI_WENYA_MODEL` | yes | 模型名 |
| `LI_WENYA_MAX_TOKENS` | no | 输出上限，建议 `3000` 到 `4000` |
| `LI_WENYA_TEMPERATURE` | no | 温度，默认建议 `0.85` |

## Data Required At Runtime

如果不上传数据，Agent 就不能读取 185 个 Wiki。

运行时需要这些 derived data：

```text
data/behavior/
data/index/
data/lore/
data/corpus/seed_chunks.md
```

其中：

- `data/lore/pages/` 包含 185 个 Wiki / Lore 页面。
- `data/index/entity_index.json` 和 `data/index/alias_index.json` 用于识别人名、机构、理论等词条。
- `data/index/voice_chunks.jsonl` 是从 transcript 生成的 Voice Evidence 检索数据。
- `data/behavior/signature_layer.json` 保存高辨识度表达和触发条件。

不需要上传：

```text
raw source videos
raw_transcripts/
.env
node_modules/
logs/
```

## Debug / Evidence Trace

页面右上角可以打开“证据追踪”。它会显示本轮命中的：

- Entity Match
- Lore Evidence
- Voice Evidence
- Signature Evidence
- Interaction State
- Retrieval Score
- Latency

这个功能默认关闭，但建议保留。它对判断“为什么这次不像”很重要。

## Optional Deployment

项目保留了 `vercel.json`，可以部署到 Vercel 或类似支持 Node serverless functions 的平台。

但中国大陆访问 Vercel 可能不稳定。如果主要面向国内用户，建议自行部署到国内服务器，并用 Nginx / PM2 / systemd 运行。

部署时必须在平台环境变量里配置自己的 Key。不要把 `.env` 上传到 GitHub。

## Project Structure

```text
li-wenya-online/
├── api/
│   ├── chat.js
│   └── health.js
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── data/
│   ├── behavior/
│   ├── corpus/
│   ├── index/
│   └── lore/
├── local-server.js
├── package.json
├── vercel.json
├── .env.example
├── LICENSE
├── DATA_LICENSE.md
└── NOTICE.md
```

## Current Limits

- Voice fidelity still depends on the underlying model.
- Some Lore pages may contain Wiki-style, fan-lore, fictional, disputed, or OCR/encoding-noisy content.
- The project does not verify scientific, medical, legal, or biographical claims as real-world facts.
- The author does not provide hosted service uptime or API quota.

## Disclaimer

This is an entertainment and internet-culture preservation project. It is not Li Wenya himself and does not represent real scientific, medical, legal, or factual advice.

Code and data rights are separated. See `LICENSE`, `DATA_LICENSE.md`, and `NOTICE.md`.
