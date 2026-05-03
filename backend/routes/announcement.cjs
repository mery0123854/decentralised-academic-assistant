// backend/routes/announcement.cjs
const express = require("express");
const router = express.Router();
const { hashText } = require("../utils/hash.cjs");
const {
  publicClient,
  walletClient,
  addresses,
  defaultAccount,
  announcementLogAbi,
} = require("../blockchain/client.cjs");
const { indexAnnouncement } = require("../rag/rag.cjs");

const localAnnouncements = [];

router.post("/", async (req, res) => {
  try {
    const { content, category = "autre", targetGroup } = req.body;
    if (!content || !targetGroup) {
      return res.status(400).json({ error: "content et targetGroup sont requis" });
    }

    const contentHash = hashText(content);

    const txHash = await walletClient.writeContract({
      address: addresses.announcementLog,
      abi: announcementLogAbi,
      functionName: "publish",
      args: [contentHash, category, targetGroup],
      account: defaultAccount,
    });

    const id = localAnnouncements.length;
    localAnnouncements.push({
      id, content, contentHash, category, targetGroup, txHash,
      date: new Date().toISOString(),
    });

    await indexAnnouncement(content, targetGroup, "annonce");
    console.log(`📢 Annonce publiée | groupe:${targetGroup}`);
    res.json({ success: true, id, contentHash, txHash });
  } catch (err) {
    console.error("❌ /announcement POST :", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { group } = req.query;
    let filtered = localAnnouncements;
    if (group && group !== "ALL") {
      filtered = localAnnouncements.filter(a => a.targetGroup === group || a.targetGroup === "ALL");
    }
    // If group is "ALL" or not provided, show all announcements (no filtering)
    res.json({ announcements: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/verify/:hash", async (req, res) => {
  try {
    const isValid = await publicClient.readContract({
      address: addresses.announcementLog,
      abi: announcementLogAbi,
      functionName: "verify",
      args: [req.params.hash],
    });
    res.json({ hash: req.params.hash, isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;