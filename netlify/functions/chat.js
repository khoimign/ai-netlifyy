const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const imageDataUrl = body.imageDataUrl || null; // data:image/...
    const imageUrl = body.imageUrl || null; // phòng khi bạn dùng URL ngoài

    // Tạo nội dung gửi cho OpenAI
    const userContent = [];

    if (message) {
      userContent.push({ type: "text", text: message });
    }

    if (imageDataUrl) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageDataUrl }
      });
    } else if (imageUrl) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    const payload = {
      model: "gpt-4o", // 👈 đảm bảo model có khả năng đọc ảnh
      messages: [
        { role: "system", content: "Bạn là trợ lý giải bài tập, hãy mô tả và giải chi tiết." },
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
