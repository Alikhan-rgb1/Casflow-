const fetch = require("node-fetch");

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = data ? JSON.parse(data) : {};
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
    return;
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "telegram_not_configured" }));
    return;
  }

  try {
    const body = await readBody(req);
    const { name, phone, answers } = body || {};

    if (!name || !phone || !Array.isArray(answers)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: false, error: "bad_request" }));
      return;
    }

    let text = "💸 Новая заявка Cash Flow\n\n";
    text += "Имя: " + name + "\n";
    text += "Телефон: " + phone + "\n\n";
    text += "Ответы:\n";

    answers.forEach((entry, idx) => {
      text += (idx + 1) + ". " + entry.question + "\n";
      text += "   Ответ: " + entry.answer + "\n\n";
    });

    const url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";

    const tgResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    if (!tgResponse.ok) {
      const errorText = await tgResponse.text();
      console.error("Telegram error", errorText);
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ok: false,
          error: "telegram_error: " + errorText
        })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "server_error" }));
  }
};
