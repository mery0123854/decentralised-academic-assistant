// backend/routes/chat.cjs (avec vrai RAG)
const express = require("express");
const router = express.Router();
const { askQuestion, getStatus } = require("../rag/rag.cjs");

router.post("/", async (req, res) => {
  try {
    const { question, studentGroup = "ALL" } = req.body;
    if (!question) return res.status(400).json({ error: "question requise" });

    const result = await askQuestion(question, studentGroup);

    res.json({
      success: true,
      question,
      answer: result.answer,
      sources: result.sources,
      studentGroup,
    });
  } catch (err) {
    console.error("❌ /chat POST :", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/status", (_req, res) => {
  res.json(getStatus());
});

module.exports = router;