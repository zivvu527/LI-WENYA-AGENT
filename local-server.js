import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import chatHandler from "./api/chat.js";
import healthHandler from "./api/health.js";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

function loadLocalEnv() {
  const envFile = path.join(ROOT, ".env");
  if (!fs.existsSync(envFile)) return;
  const text = fs.readFileSync(envFile, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const equalsAt = line.indexOf("=");
    if (equalsAt <= 0) continue;
    const key = line.slice(0, equalsAt).trim();
    const value = line.slice(equalsAt + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT || 8787);

function sendFile(res, file, type) {
  const body = fs.readFileSync(file);
  res.writeHead(200, {"Content-Type": type, "Content-Length": body.length});
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/health") {
      healthHandler(req, {
        status(code) {
          res.statusCode = code;
          return this;
        },
        json(obj) {
          const body = Buffer.from(JSON.stringify(obj), "utf8");
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Content-Length", body.length);
          res.end(body);
        }
      });
      return;
    }
    if (url.pathname === "/api/chat") {
      req.body = await readJson(req);
      await chatHandler(req, res);
      return;
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      sendFile(res, path.join(PUBLIC, "index.html"), "text/html; charset=utf-8");
      return;
    }
    if (url.pathname === "/app.js") {
      sendFile(res, path.join(PUBLIC, "app.js"), "application/javascript; charset=utf-8");
      return;
    }
    if (url.pathname === "/style.css") {
      sendFile(res, path.join(PUBLIC, "style.css"), "text/css; charset=utf-8");
      return;
    }
    res.writeHead(404);
    res.end("Not found");
  } catch (error) {
    res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
    res.end(error?.stack || String(error));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Li Wenya Agent Online preview: http://127.0.0.1:${PORT}`);
});
