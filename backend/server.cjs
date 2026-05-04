// backend/server.cjs
const express = require("express");
const cors = require("cors");
const path = require("path");
const { addresses, publicClient, roleManagerAbi } = require("./blockchain/client.cjs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers frontend statiques
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes API
app.use("/api/announcement", require("./routes/announcement.cjs"));
app.use("/api/document", require("./routes/document.cjs"));
app.use("/api/chat", require("./routes/chat.cjs"));
app.use("/api/acknowledge", require("./routes/acknowledge.cjs"));
app.use("/api/verify", require("./routes/verify.cjs"));
app.get("/contract-addresses.json", (req, res) => {
  res.sendFile(path.join(__dirname, "../contract-addresses.json"));
});

// Récupérer le groupe d'un étudiant
app.get("/api/student-group/:address", async (req, res) => {
  try {
    const group = await publicClient.readContract({
      address: addresses.roleManager,
      abi: roleManagerAbi,
      functionName: "getGroup",
      args: [req.params.address],
    });
    res.json({ group: group || "ALL" });
  } catch (err) {
    console.error("❌ /api/student-group error :", err.message);
    res.json({ group: "ALL" });
  }
});

// Route de santé
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", message: "Serveur opérationnel", timestamp: new Date().toISOString() });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/announcement`);
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log(`   POST http://localhost:${PORT}/api/document`);
});