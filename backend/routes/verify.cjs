// backend/routes/verify.cjs
const express = require("express");
const router = express.Router();
const {
  publicClient,
  addresses,
  documentRegistryAbi,
  announcementLogAbi,
} = require("../blockchain/client.cjs");

// GET /document/:hash — Vérifier un document
router.get("/document/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const isValid = await publicClient.readContract({
      address: addresses.documentRegistry,
      abi: documentRegistryAbi,
      functionName: "verifyDocument",
      args: [hash],
    });
    res.json({ hash, isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /announcement/:hash — Vérifier une annonce
router.get("/announcement/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const isValid = await publicClient.readContract({
      address: addresses.announcementLog,
      abi: announcementLogAbi,
      functionName: "verify",
      args: [hash],
    });
    res.json({ hash, isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;