// backend/rag/vectorStore.cjs
// Mémoire du système : stocke les morceaux d'annonces avec leurs vecteurs

/** @type {{ id: number, text: string, embedding: number[], group: string, source: string }[]} */
let chunks = [];

function addChunk(text, embedding, group, source = "annonce") {
  chunks.push({ id: chunks.length, text, embedding, group, source });
}

function searchSimilar(queryEmbedding, userGroup, topK = 5) {
  const allowed = chunks.filter(c => c.group === userGroup || c.group === "ALL");

  if (allowed.length === 0) return [];

  function cosineSim(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
  }

  return allowed
    .map(c => ({ ...c, score: cosineSim(queryEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function getAllChunks() { return chunks; }
function clearAll() { chunks = []; }

module.exports = { addChunk, searchSimilar, getAllChunks, clearAll };