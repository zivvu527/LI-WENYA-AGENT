export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    version: "1.0.0",
    model: process.env.LI_WENYA_MODEL || "deepseek-chat"
  });
}
