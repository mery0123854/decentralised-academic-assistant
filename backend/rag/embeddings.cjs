// backend/rag/embeddings.cjs
// Transforme du texte en vecteurs (embeddings) avec un modèle local gratuit

let pipelineInstance = null;

async function loadModel() {
  if (pipelineInstance) return pipelineInstance;

  const { pipeline } = await import("@xenova/transformers");

  console.log("🤖 Chargement du modèle d'embeddings... (30s la première fois)");
  pipelineInstance = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Modèle chargé !");

  return pipelineInstance;
}

async function getEmbedding(text) {
  const model = await loadModel();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

function chunkText(text, maxLen = 300) {
  if (text.length <= maxLen) return [text];

  const sentences = text.split(/(?<=[.!?])\s+/);
  const result = [];
  let current = "";

  for (const s of sentences) {
    if ((current + " " + s).trim().length <= maxLen) {
      current = (current + " " + s).trim();
    } else {
      if (current) result.push(current);
      current = s;
    }
  }
  if (current) result.push(current);
  return result;
}

module.exports = { getEmbedding, chunkText, loadModel };