const express = require("express");
const router = express.Router();
const { publicClient, addresses, acknowledgmentLogAbi } = require("../blockchain/client.cjs");

router.get("/announcement/:id", async (req, res) => {
  try {
    const announcementId = BigInt(req.params.id);
    const acknowledgments = await publicClient.readContract({
      address: addresses.acknowledgmentLog,
      abi: acknowledgmentLogAbi,
      functionName: "getAcknowledgments",
      args: [announcementId],
    });
    res.json({ acknowledgments });
  } catch (err) {
    console.error("❌ /acknowledge GET error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;