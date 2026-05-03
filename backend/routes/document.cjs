// backend/routes/document.cjs
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { hashFile } = require("../utils/hash.cjs");
const { walletClient, addresses, documentRegistryAbi, defaultAccount } = require("../blockchain/client.cjs");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Fichier requis" });
    }

    const fileHash = hashFile(req.file.buffer);
    const fileName = req.file.originalname;
    const targetGroup = req.body.targetGroup || "ALL";

    console.log("📄 Tentative d'enregistrement :", { fileHash, fileName, targetGroup });

    const txHash = await walletClient.writeContract({
      address: addresses.documentRegistry,
      abi: documentRegistryAbi,
      functionName: "register",
      args: [fileHash, fileName, targetGroup],
      account: defaultAccount,
    });

    console.log(`📄 Document enregistré | ${fileName} | hash: ${fileHash} | tx: ${txHash}`);

    res.json({ success: true, fileHash, fileName, targetGroup, txHash });
  } catch (err) {
    console.error("❌ /document POST :", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;