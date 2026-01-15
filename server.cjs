const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn("TG_BOT_TOKEN или TG_CHAT_ID не заданы. Отправка в Telegram работать не будет.");
}

app.post("/api/quiz-submit", async (req, res) => {
  try {
    const { name, phone, answers } = req.body;

    if (!name || !phone || !Array.isArray(answers)) {
      return res.status(400).json({ ok: false, error: "bad_request" });
    }

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: "telegram_not_configured" });
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
      console.error("Telegram error", await tgResponse.text());
      return res.status(502).json({ ok: false, error: "telegram_error" });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Telegram relay server listening on http://localhost:" + PORT);
});

