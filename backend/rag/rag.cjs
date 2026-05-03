// backend/rag/rag.cjs
// Moteur RAG : indexation + recherche + génération de réponses

const { getEmbedding, chunkText } = require("./embeddings.cjs");
const { addChunk, searchSimilar, getAllChunks, clearAll } = require("./vectorStore.cjs");

async function indexAnnouncement(content, group, source = "annonce") {
  const chunks = chunkText(content);
  for (const chunk of chunks) {
    const emb = await getEmbedding(chunk);
    addChunk(chunk, emb, group, source);
  }
  console.log(`📚 "${content.substring(0, 50)}..." indexé (${chunks.length} morceaux)`);
}

async function askQuestion(question, userGroup) {
  const qEmb = await getEmbedding(question);
  const results = searchSimilar(qEmb, userGroup, 5);

  if (results.length === 0) {
    return {
      answer: "Je n'ai trouvé aucune information sur ce sujet dans les annonces.",
      sources: [],
    };
  }

  const answer = buildAnswer(question, results);

  return {
    answer,
    sources: results.map(r => ({
      text: r.text.substring(0, 120),
      group: r.group,
      score: Math.round(r.score * 100) / 100,
    })),
  };
}

function buildAnswer(question, results) {
  const q = question.toLowerCase();
  const best = results[0].text;

  if (q.includes("examen") || q.includes("exam") || q.includes("quand") || q.includes("date")) {
    const dateMatch = best.match(/\d{1,2}\s*(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i);
    if (dateMatch) return `D'après les annonces, l'événement aura lieu le ${dateMatch[0]}.`;
  }

  return `D'après les annonces du professeur : ${best}`;
}

function getStatus() {
  const chunks = getAllChunks();
  return {
    totalChunks: chunks.length,
    groups: [...new Set(chunks.map(c => c.group))],
  };
}

module.exports = { indexAnnouncement, askQuestion, getStatus, clearAll };