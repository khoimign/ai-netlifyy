// netlify/functions/chat.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const imageDataUrl = body.imageDataUrl || null; // data:image/...

    let userContent = message;
    if (imageDataUrl) userContent += `\n\n[IMAGE_DATA_URL]\n${imageDataUrl}`;

    const payload = {
      model: "gpt-4o-mini", // ví dụ, đổi nếu cần / nếu account có model khác
      messages: [
        { role: "system", content: "Bạn là trợ lý giúp học tập, trả lời chi tiết." },
        { role: "user", content: userContent }
      ],
      max_tokens: 800
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
