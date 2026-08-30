import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const INDEX = path.join(DATA, "index");

let cache = {};

const META_TERMS = ["skill", "github", "runtime", "voice", "lore", "debug", "prompt", "项目", "安装"];
const THEORY_TERMS = ["牛顿", "万有引力", "相对论", "爱因斯坦", "引力", "旧理论", "新理论", "地球", "月球", "太阳", "理论"];
const CHALLENGE_TERMS = ["不对", "反驳", "证明", "证据", "依据", "为什么不对", "很对啊", "错", "质疑"];
const DEVICE_TERMS = ["电脑", "手机", "鼠标", "键盘", "打开", "打不开", "卡", "坏了", "屏幕", "密码", "软件"];
const SELF_TERMS = ["你以前", "你过去", "深圳", "经历", "你是不是", "你研究过", "你是谁", "糖尿病", "血糖", "吃饭", "黑体生物"];
const JUDGMENT_TERMS = ["怎么样", "怎么看", "喜欢吗", "评价", "咋样"];
const WENYA_ENTITY_HINTS = ["碧桑", "教授", "文亚", "研究所", "理论", "宇宙", "李文亚"];
const CURATED_BACKGROUND_TERMS = ["黑体生物", "糖尿病", "血糖", "吃饭", "消灭", "控制"];
const BISANG_TERMS = ["碧桑架dell", "碧桑驾dell", "碧桑架 dell", "碧桑", "白体生物饮料"];

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(readText(file));
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return readText(file).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function memo(key, loader) {
  if (!(key in cache)) cache[key] = loader();
  return cache[key];
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "").replace(/銆€/g, "");
}

function tokenize(value) {
  const text = normalizeText(value);
  const tokens = [];
  tokens.push(...(text.match(/[a-z0-9]+/g) || []));
  tokens.push(...(text.match(/[\u4e00-\u9fff]{2,}/g) || []));
  const chars = [...text].filter((ch) => ch >= "\u4e00" && ch <= "\u9fff");
  tokens.push(...chars);
  for (let i = 0; i < Math.max(0, text.length - 1); i += 1) tokens.push(text.slice(i, i + 2));
  return tokens.filter(Boolean);
}

function hasAny(text, terms) {
  return terms.some((term) => term && text.includes(term));
}

function classifyInteraction(message, entityMatches) {
  const m = message.toLowerCase();
  if (hasAny(m, META_TERMS)) return "meta_project";
  const theoryHit = hasAny(m, THEORY_TERMS);
  const challengeHit = hasAny(m, CHALLENGE_TERMS);
  if (theoryHit && challengeHit) return "challenge_to_theory";
  if (theoryHit) return "known_theory_conflict";
  if (challengeHit) return "challenge_to_theory";
  if (hasAny(m, DEVICE_TERMS)) return "device_or_obstruction";
  if (hasAny(m, SELF_TERMS)) return "self_related";
  if (entityMatches.length) return "known_lore_entity";
  if (hasAny(m, JUDGMENT_TERMS)) return "ordinary_judgment";
  return "ordinary_social_judgment";
}

function isDellDeviceQuery(message) {
  const m = message.toLowerCase();
  return m.includes("dell") && hasAny(m, DEVICE_TERMS) && !hasAny(m, WENYA_ENTITY_HINTS);
}

function shouldSkipEntity(ent, message, matchType) {
  const title = ent.title || "";
  if (isDellDeviceQuery(message) && title.includes("碧桑")) return true;
  if (matchType === "token_overlap" && message.toLowerCase().includes("dell") && title.includes("碧桑") && !hasAny(message, WENYA_ENTITY_HINTS)) return true;
  return false;
}

function resolveEntities(message, limit = 5) {
  const aliasIndex = memo("aliasIndex", () => readJson(path.join(INDEX, "alias_index.json"), {}));
  const entities = memo("entities", () => readJson(path.join(INDEX, "entity_index.json"), []));
  const byTitle = new Map(entities.map((e) => [normalizeText(e.title), e]));
  const normMsg = normalizeText(message);
  const matches = [];

  for (const [alias, targets] of Object.entries(aliasIndex)) {
    if (alias && normMsg.includes(alias)) {
      for (const target of targets) {
        const ent = byTitle.get(normalizeText(target.title)) || target;
        if (shouldSkipEntity(ent, message, "alias")) continue;
        matches.push({...ent, matched_alias: alias, score: 100 + Math.min(alias.length, 40), match_type: "alias"});
      }
    }
  }

  const msgTokens = new Set(tokenize(message));
  for (const ent of entities) {
    const title = ent.title || "";
    const titleNorm = normalizeText(title);
    if (!titleNorm || matches.some((m) => m.title === title)) continue;
    if (titleNorm && normMsg.includes(titleNorm)) {
      if (!shouldSkipEntity(ent, message, "title")) matches.push({...ent, matched_alias: title, score: 80 + Math.min(titleNorm.length, 30), match_type: "title"});
      continue;
    }
    const titleTokens = new Set(tokenize(title));
    const overlap = [...titleTokens].filter((t) => msgTokens.has(t)).length;
    const overlapRatio = overlap / Math.max(titleTokens.size, 1);
    if (overlap >= 3 && overlapRatio >= 0.35 && titleNorm.length >= 3 && !shouldSkipEntity(ent, message, "token_overlap")) {
      matches.push({...ent, matched_alias: title, score: 20 + overlap, match_type: "token_overlap"});
    }
  }

  return matches.sort((a, b) => (b.score || 0) - (a.score || 0) || (b.plain_chars || 0) - (a.plain_chars || 0)).slice(0, limit);
}

function extractPlainText(pageText) {
  let text = pageText;
  if (text.includes("## Plain Text")) text = text.split("## Plain Text", 2)[1];
  if (text.includes("## Wikitext")) text = text.split("## Wikitext", 2)[0];
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function pagePathFor(ent) {
  const file = ent.file || "";
  if (file.startsWith("data/lore")) return path.join(ROOT, file);
  return path.join(DATA, "lore", "pages", path.basename(file));
}

function curatedBackground(message) {
  const evidence = [];
  if (hasAny(message, CURATED_BACKGROUND_TERMS)) {
    evidence.push({
      id: "curated_self_report_black_body_diabetes",
      title: "黑体生物与糖尿病控制自述",
      source_type: "SELF-REPORTED / USER-CURATED",
      score: 45,
      match_type: "curated_background",
      file: "data/lore/curated_background.json",
      excerpt: "李文亚自称他体内黑体生物基本被消灭；他说自己吃饭很多；因此他认为自己的糖尿病基本得到控制。这是角色背景与自述，不得作为现实医疗建议。"
    });
  }
  if (hasAny(message.toLowerCase(), BISANG_TERMS)) {
    evidence.push({
      id: "curated_bisangjia_dell",
      title: "碧桑架dell",
      source_type: "WIKI-DOCUMENTED / USER-CURATED",
      score: 45,
      match_type: "curated_background",
      matched_alias: "碧桑架dell",
      file: "data/lore/curated_background.json",
      excerpt: "碧桑架dell是文亚宇宙中的人物/创作者，不是 Dell 电脑品牌。其相关设定围绕白体生物、黑体生物、白体生物饮料、理论归属和与李文亚的冲突展开。"
    });
  }
  return evidence;
}

function findLoreByText(message, limit = 6) {
  const entities = memo("entities", () => readJson(path.join(INDEX, "entity_index.json"), []));
  const anchors = [...THEORY_TERMS, "星球三重引力范围", "地球运动模型", "李文亚粒子"];
  const queryTerms = anchors.filter((term) => message.includes(term));
  const terms = queryTerms.length ? queryTerms : tokenize(message).slice(0, 8);
  const scored = [];

  for (const ent of entities) {
    const file = pagePathFor(ent);
    if (!fs.existsSync(file)) continue;
    const hay = `${ent.title || ""}\n${readText(file).slice(0, 5000)}`;
    let score = terms.reduce((sum, term) => sum + (term && hay.includes(term) ? 10 : 0), 0);
    if (hasAny(hay, ["星球三重引力范围", "地球运动模型", "李文亚粒子", "牛顿"])) score += 3;
    if (["星球三重引力范围", "地球运动模型", "李文亚粒子", "太阳直径四十二亿千米说", "牛顿"].includes(ent.title)) score += 20;
    if (score) scored.push([score, {...ent, score, match_type: "text_search"}]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, item]) => item);
}

function retrieveLore(message, entityMatches, limit = 3) {
  const evidence = curatedBackground(message);
  const candidates = [];
  if (hasAny(message, THEORY_TERMS)) candidates.push(...findLoreByText(message, 6));
  candidates.push(...entityMatches);
  const seen = new Set();

  for (const ent of candidates) {
    const key = ent.page_id || ent.title;
    if (seen.has(key)) continue;
    seen.add(key);
    if (evidence.length >= limit) break;
    const file = pagePathFor(ent);
    if (!fs.existsSync(file)) continue;
    evidence.push({
      id: ent.page_id,
      title: ent.title,
      source_type: ent.source_type || "UNKNOWN",
      score: ent.score || 0,
      match_type: ent.match_type,
      matched_alias: ent.matched_alias,
      file: path.relative(ROOT, file).replace(/\\/g, "/"),
      excerpt: extractPlainText(readText(file)).slice(0, 1200)
    });
  }
  return evidence.slice(0, limit);
}

function speechActTerms(state) {
  const mapping = {
    known_lore_entity: ["批判", "怎么看", "理论", "人物", "质疑", "反驳", "恶不恶"],
    known_theory_conflict: ["牛顿", "万有引力", "引力", "旧理论", "新理论", "推翻", "错不错", "该不该"],
    challenge_to_theory: ["证据", "事实", "依据", "证明", "找出来", "拿出来", "质疑", "反驳", "你能够解释"],
    device_or_obstruction: ["电脑", "鼠标", "打不开", "点击", "写作", "不起作用", "密码", "坏了"],
    ordinary_judgment: ["怎么看", "怎么样", "该不该", "是不是", "问题", "喜欢"],
    ordinary_social_judgment: ["怎么看", "为什么", "该不该", "问题", "是不是"],
    self_related: ["我", "研究", "写作", "经历", "观点", "科学研究", "黑体生物", "糖尿病"]
  };
  return mapping[state] || ["问题", "是不是", "为什么"];
}

function scoreVoiceChunk(chunk, queryTokens, terms) {
  const text = [chunk.transcript || "", ...(chunk.keywords || []), chunk.speech_act || ""].join(" ");
  const chunkTokens = new Set(tokenize(text));
  let score = [...queryTokens].filter((t) => chunkTokens.has(t)).length;
  for (const term of terms) if (term && text.includes(term)) score += 5;
  if (chunk.source_kind === "manual_seed") score += 10;
  if (chunk.confidence === "HIGH") score += 6;
  if (chunk.confidence === "LOW") score -= 3;
  if (hasAny(chunk.transcript || "", ["！", "!", "？", "?"])) score += 2;
  return score;
}

function retrieveVoice(message, interactionState, loreEvidence, limit = 8) {
  const chunks = memo("voiceChunks", () => readJsonl(path.join(INDEX, "voice_chunks.jsonl")));
  const loreText = loreEvidence.map((e) => `${e.title || ""} ${(e.excerpt || "").slice(0, 300)}`).join(" ");
  const terms = speechActTerms(interactionState);
  const queryTokens = new Set(tokenize(`${message} ${loreText} ${terms.join(" ")}`));
  const scored = chunks.map((chunk) => [scoreVoiceChunk(chunk, queryTokens, terms), chunk]).filter(([score]) => score > 0);
  scored.sort((a, b) => b[0] - a[0]);

  const selected = [];
  const seenVideos = new Map();
  for (const [score, chunk] of scored) {
    const video = chunk.source_video || "";
    if ((seenVideos.get(video) || 0) >= 3 && chunk.source_kind !== "manual_seed") continue;
    selected.push({
      id: chunk.id,
      video,
      timestamp: `${chunk.start_timestamp || ""}-${chunk.end_timestamp || ""}`,
      score,
      speech_act: chunk.speech_act,
      confidence: chunk.confidence,
      source_kind: chunk.source_kind,
      transcript: (chunk.transcript || "").slice(0, 500)
    });
    seenVideos.set(video, (seenVideos.get(video) || 0) + 1);
    if (selected.length >= limit) break;
  }
  return selected;
}

function retrieveSignature(message, interactionState, loreEvidence, limit = 6) {
  const layer = memo("signatureLayer", () => readJson(path.join(DATA, "behavior", "signature_layer.json"), {items: []}).items || []);
  const hay = `${message}\n${interactionState}\n${loreEvidence.map((e) => `${e.title || ""} ${(e.excerpt || "").slice(0, 500)}`).join("\n")}`;
  const scored = [];
  for (const item of layer) {
    if (!item.suitable_for_signature_layer) continue;
    let score = 0;
    if (item.text && hay.includes(item.text)) score += 30;
    for (const variant of item.variants || []) if (variant && hay.includes(variant)) score += 20;
    for (const term of tokenize(item.typical_trigger || "")) if (term && hay.includes(term)) score += 2;
    const itemId = item.id || "";
    const speechAct = item.speech_act || "";
    if (item.category === "SIGNATURE_PUNCTUATION/RHYTHM") score += 12;
    if (itemId === "move_not_quote_bank") score += 8;
    if (interactionState === "challenge_to_theory" && hasAny(speechAct + itemId, ["burden", "challenge", "attack", "theory", "jiu_li_lun", "xin_li_lun"])) score += 10;
    if (interactionState === "known_theory_conflict" && hasAny(itemId, ["jiu_li_lun", "xin_li_lun", "gai_bu_gai", "explain"])) score += 10;
    if (interactionState === "known_lore_entity" && ["phrase_e_bu_e", "syntax_shi_bu_shi", "rhythm_short_subtitle", "move_not_quote_bank"].includes(itemId)) score += 7;
    if (itemId === "phrase_e_bu_e" && hasAny(hay, ["碧桑", "冲突", "打压", "阻挡", "压制", "阴险", "恶势力"])) score += 22;
    if (interactionState === "device_or_obstruction" && ["syntax_shi_bu_shi", "syntax_gai_bu_gai", "rhythm_short_subtitle", "move_not_quote_bank"].includes(itemId)) score += 6;
    if (score && item.confidence === "HIGH") score += 4;
    if (score && item.confidence === "MEDIUM") score += 2;
    if (score > 0) scored.push([score, item]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([score, item]) => ({
    id: item.id,
    category: item.category,
    text: item.text,
    count: item.count,
    videos: item.videos || [],
    speech_act: item.speech_act,
    typical_trigger: item.typical_trigger,
    confidence: item.confidence,
    score,
    evidence: (item.evidence || []).slice(0, 3)
  }));
}

function behavioralPriorFor(state) {
  const priors = {
    known_theory_conflict: ["Do not give a neutral science-history answer.", "Use old-theory/new-theory conflict only when supported by evidence.", "Allow abrupt challenge, repeated questions, and strong judgment."],
    challenge_to_theory: ["Treat disagreement as a demand for evidence.", "Do not calmly improve the argument into generic scientific modesty.", "Preserve burden-of-proof pressure and repeated questioning."],
    known_lore_entity: ["Use Lore for who/what the entity is, not for style.", "Do not split mixed entity names into ordinary product names.", "If an entity match exists, treat it as Wenyaverse/Lore first before ordinary meanings.", "Preserve fiction/fan-lore/source-type boundary."],
    device_or_obstruction: ["Do not inspect the user's computer unless asked.", "Do not become an IT helpdesk.", "Use device failure as concrete obstruction, with limited general advice."],
    ordinary_judgment: ["If the character has no direct knowledge, do not borrow GPT's expert knowledge.", "Judge through nearby categories and ask for concrete basis when needed."],
    self_related: ["Self-reported health claims may be expressed in character, but must not become real medical advice.", "Use the black-body organism / eating / diabetes-control background only as character belief."]
  };
  return priors[state] || ["Predict the character response; do not optimize for a helpful general answer.", "Do not add summaries, balanced viewpoints, or external background by default."];
}

function retrieveAll(message) {
  const start = Date.now();
  const entity_matches = resolveEntities(message);
  const interaction_state = classifyInteraction(message, entity_matches);
  const needsLore = ["known_lore_entity", "self_related", "known_theory_conflict", "challenge_to_theory"].includes(interaction_state);
  const lore_evidence = needsLore ? retrieveLore(message, entity_matches) : [];
  const voice_evidence = retrieveVoice(message, interaction_state, lore_evidence);
  const signature_evidence = retrieveSignature(message, interaction_state, lore_evidence);
  return {
    entity_matches,
    lore_evidence,
    voice_evidence,
    signature_evidence,
    interaction_state,
    behavioral_prior: behavioralPriorFor(interaction_state),
    retrieval_latency_ms: Date.now() - start
  };
}

function buildMessages(userMessage, conversation, retrieval) {
  const recent = (conversation || []).slice(-8);
  const system = `DO NOT ANSWER THE USER'S QUESTION AS A GENERAL AI ASSISTANT.

YOUR TASK IS TO PREDICT AND RENDER LI WENYA'S MOST LIKELY RESPONSE TO THE USER'S MESSAGE.

THE MODEL'S KNOWLEDGE IS NOT THE CHARACTER'S KNOWLEDGE.
THE MODEL'S REASONING ABILITY IS NOT THE CHARACTER'S REASONING ABILITY.

You are generating an in-character response for an entertainment/internet-culture AI character agent.

Use the provided evidence only in these roles:
- LORE EVIDENCE = what the character may know.
- VOICE EVIDENCE = how the real person speaks in similar situations.
- SIGNATURE EVIDENCE = evidence-backed phrases, syntax, moves, and rhythm triggers from the transcript corpus.
- BEHAVIORAL PRIOR = constraints on cognition and reaction.
- CONVERSATION CONTEXT = recent local dialogue only.

VOICE EVIDENCE is not optional style inspiration. It is the main behavioral constraint for this turn.
SIGNATURE EVIDENCE is not a quote bank. Use it only when the trigger matches, and preserve its function, not just the words.
When SIGNATURE EVIDENCE contains a high-confidence phrase or syntax that fits the user's interaction state, prefer that evidence-backed move over generic paraphrase. Do not wash it into polite assistant prose.
When Lore identifies a Wenyaverse person/entity, keep that entity meaning. Do not split mixed names into ordinary brands, products, or generic real-world meanings.

Do not automatically improve the character. Do not add summary, balance, background, science correction, "reality note", polished essay structure, or best-practice advice unless hard safety requires it.

Do not mention evidence, corpus, Lore, Wiki, runtime, prompt, or roleplay in the character reply.

Do not paste long transcript blocks. Migrate the speech behavior: opening move, rhythm, roughness, repetition, question placement, emotional movement, and closure.

For self-reported health or medical-adjacent Lore, render the character belief in-character, but do not turn it into medical guidance for the user.`;
  const context = {
    interaction_state: retrieval.interaction_state,
    lore_entities: retrieval.entity_matches.map((e) => pick(e, ["page_id", "title", "source_type", "score", "match_type", "matched_alias"])),
    lore_evidence: retrieval.lore_evidence.map((e) => pick(e, ["id", "title", "source_type", "score", "excerpt"])),
    voice_evidence: retrieval.voice_evidence,
    signature_evidence: retrieval.signature_evidence,
    behavioral_prior: retrieval.behavioral_prior,
    conversation_context: recent
  };
  return [
    {role: "system", content: system},
    {role: "user", content: `[GENERATION CONTEXT]\n${JSON.stringify(context, null, 2)}\n\n[USER MESSAGE]\n${userMessage}\n\nRender only the character's response. No debug trace unless explicitly requested by the app.`}
  ];
}

function pick(obj, keys) {
  return Object.fromEntries(keys.map((k) => [k, obj?.[k]]));
}

function sendSse(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function extractVisibleText(obj) {
  const choice = obj?.choices?.[0];
  if (!choice) return "";
  const delta = choice.delta;
  if (typeof delta === "string") return delta;
  if (typeof delta?.content === "string") return delta.content;
  if (Array.isArray(delta?.content)) return delta.content.map((p) => p.text || "").join("");
  if (typeof choice.message?.content === "string") return choice.message.content;
  if (Array.isArray(choice.message?.content)) return choice.message.content.map((p) => p.text || "").join("");
  if (typeof choice.text === "string") return choice.text;
  return "";
}

async function streamModel(messages, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.LI_WENYA_MODEL || "deepseek-chat";
  const maxTokens = Number(process.env.LI_WENYA_MAX_TOKENS || 4000);
  const temperature = Number(process.env.LI_WENYA_TEMPERATURE || 0.85);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    body: JSON.stringify({model, messages, temperature, max_tokens: maxTokens, stream: true})
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Model API error ${response.status}: ${text.slice(0, 1000)}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/event-stream")) {
    const obj = await response.json();
    const text = extractVisibleText(obj);
    if (!text) throw new Error("Model API returned no visible content.");
    sendSse(res, "token", text);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let emitted = false;
  let reasoningChunks = 0;
  let finishReasons = [];

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true});
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";
    for (const block of blocks) {
      for (const line of block.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;
        let obj;
        try {
          obj = JSON.parse(data);
        } catch {
          continue;
        }
        const choice = obj?.choices?.[0];
        if (choice?.finish_reason) finishReasons.push(choice.finish_reason);
        if (choice?.delta?.reasoning_content) reasoningChunks += 1;
        const text = extractVisibleText(obj);
        if (text) {
          emitted = true;
          sendSse(res, "token", text);
        }
      }
    }
  }
  if (!emitted) {
    if (reasoningChunks && finishReasons.includes("length")) {
      throw new Error("模型只返回了 reasoning_content，正文被 max_tokens 截断。请在部署环境提高 LI_WENYA_MAX_TOKENS，或换 deepseek-chat。");
    }
    throw new Error("Model API finished but returned no visible content.");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  try {
    const {message = "", conversation = [], debug = false} = req.body || {};
    sendSse(res, "status", "正在检索角色证据...");
    const retrieval = retrieveAll(String(message).trim());
    if (debug) sendSse(res, "debug", retrieval);
    sendSse(res, "status", "正在生成回答...");
    await streamModel(buildMessages(message, conversation, retrieval), res);
    sendSse(res, "done", {ok: true});
    res.end();
  } catch (error) {
    sendSse(res, "error", error?.message || String(error));
    sendSse(res, "done", {ok: false});
    res.end();
  }
}
