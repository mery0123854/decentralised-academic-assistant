// backend/utils/hash.cjs
const crypto = require("crypto");

/**
 * Hash SHA-256 d'un texte → retourne une chaîne hex
 */
function hashText(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * Hash SHA-256 d'un buffer (fichier) → retourne une chaîne hex
 */
function hashFile(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

module.exports = { hashText, hashFile };