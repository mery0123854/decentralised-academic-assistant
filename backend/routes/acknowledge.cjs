// backend/routes/acknowledge.cjs
const express = require("express");
const router = express.Router();
const {
  publicClient,
  addresses,
  acknowledgmentLogAbi,
} = require("../blockchain/client.cjs");

// GET /announcement/:id — Récupérer les signatures pour une annonce
router.get("/announcement/:id", async (req, res) => {
  try {
    const announcementId = BigInt(req.params.id);

    const acknowledgments = await publicClient.readContract({
      address: addresses.acknowledgmentLog,
      abi: acknowledgmentLogAbi,
      functionName: "getAcknowledgments",
      args: [announcementId],
    });

    // Convertir les données pour le frontend
    const formatted = acknowledgments.map(ack => ({
      announcementId: ack.announcementId.toString(),
      student: ack.student,
      timestamp: ack.timestamp.toString(),
      date: new Date(Number(ack.timestamp) * 1000).toLocaleString('fr-FR')
    }));

    res.json({ acknowledgments: formatted });
  } catch (err) {
    console.error("❌ /acknowledge GET :", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;