// routes/chat.js
const express = require("express");
const router = express.Router();
const chatbot = require("../lib/chatbot");

// POST /api/chat - balasan dummy diproses di backend (bukan API AI eksternal)
router.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || String(message).trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Pesan tidak boleh kosong."
    });
  }

  const reply = chatbot.getReply(message);

  res.json({
    success: true,
    data: {
      reply,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
