const express = require("express");
const router = express.Router();
const { publicClient, addresses, documentRegistryAbi } = require("../blockchain/client.cjs");

router.get("/document/:hash", async (req, res) => {
  try {
    const hash = req.params.hash;
    const isValid = await publicClient.readContract({
      address: addresses.documentRegistry,
      abi: documentRegistryAbi,
      functionName: "verifyDocument",
      args: [hash],
    });
    res.json({ hash, isValid });
  } catch (err) {
    console.error("❌ /verify/document error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;