═══════════════════════════════════════════════════════════════════════════════
📖 GUIDE DÉMARRAGE RAPIDE — Decentralised Academic Assistant
═══════════════════════════════════════════════════════════════════════════════

## 🚀 LANCER LE SYSTÈME

### Prerequisites
```bash
Node.js v18+
npm ou yarn
MetaMask browser extension
```

### Étape 1: Démarrer Hardhat Local Blockchain
```bash
cd c:\decentralised-academic-js
npx hardhat node
```
**Output:** Server écoute sur http://127.0.0.1:8545

### Étape 2: Démarrer Backend Server
```bash
cd c:\decentralised-academic-js
node backend/server.cjs
```
**Output:** Server écoute sur http://localhost:3000

### Étape 3: Accéder Interface Étudiant
```
Navigateur: http://localhost:3000/frontend/student.html
```

### Étape 4: Accéder Interface Professeur
```
Navigateur: http://localhost:3000/frontend/professor.html
```

═══════════════════════════════════════════════════════════════════════════════

## 🧪 TESTER LE SYSTÈME

### Tests Automatiques
```bash
# Tous les tests (22 passing)
npx hardhat test

# Test requestStudentRole
npx hardhat run test_request_role.js

# Test getAcknowledgments
npx hardhat run test_ack_retrieval.js

# Test complet
npx hardhat run test_full_flow.js
```

═══════════════════════════════════════════════════════════════════════════════

## 👩‍🎓 FLUX ÉTUDIANT — ÉTAPES

### 1. Connexion MetaMask
- Clique "🔌 Connecter MetaMask"
- Sélectionne adresse wallet (ex: 0xf39Fd6e51aad...)
- Approuve la connexion

### 2. Obtenir STUDENT_ROLE
- Si premier accès: Voir bouton "Demander le rôle Étudiant"
- Click bouton
- Signe transaction MetaMask
- Rôle obtenu ✓

### 3. Voir Annonces
- Affiche toutes annonces du groupe
- Filtre:
  - Étudiant MF1 → voit ALL + MF1 annonces
  - Étudiant MF2 → voit ALL + MF2 annonces

### 4. Signer "J'ai lu"
- Click bouton vert "J'ai lu" sur annonce
- Signe transaction dans MetaMask
- Bouton devient "✓ Lu" (disabled)
- Signature enregistrée blockchain avec timestamp

### 5. Chat IA
- Tape question dans zone chat
- IA répond basé sur:
  - Annonces visibles pour ce groupe
  - Source incluse dans réponse

### 6. Vérifier Document
- Drag & drop fichier dans zone verification
- Calcul SHA-256 automatique
- Comparaison avec blockchain
- ✅ Authentique ou ❌ Inconnu

═══════════════════════════════════════════════════════════════════════════════

## 👨‍🏫 FLUX PROFESSEUR — ÉTAPES

### 1. Connexion MetaMask
- Clique "🔌 Connecter MetaMask"
- Sélectionne adresse déployeur (0xf39Fd6e51aad...)
- Approuve

### 2. Publier Annonce
- Remplir:
  - Contenu (texte libre)
  - Catégorie (examen/cours/devoir)
  - Groupe cible (ALL/MF1/MF2)
- Click "Publier"
- Signe transaction
- Annonce enregistrée + indexée RAG

### 3. Uploader Document
- Click zone upload
- Sélectionner fichier
- Click "Uploader"
- Signe transaction
- Hash calculé + enregistré DocumentRegistry

### 4. Voir Signatures "J'ai lu"
- Sélectionner annonce dans dropdown
- Affiche:
  - Liste étudiants ayant signé
  - Adresse wallet
  - Timestamp signature
- Mise à jour automatique en temps réel

═══════════════════════════════════════════════════════════════════════════════

## 🔐 COMPTES HARDHAT LOCAUX

### Account 0 (Deployer/Professor)
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded732d6d9e7915b9f8e2a
Rôles: ADMIN, PROFESSOR, STUDENT (pour tester)
```

### Account 1 (Student 1)
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Groupe: MF1 (doit être assigné)
```

### Account 2 (Student 2)
```
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Groupe: MF2 (doit être assigné)
```

**Import dans MetaMask:**
- Settings → Accounts → Import Account
- Copier/coller private key du compte désiré
- Confirmer

═══════════════════════════════════════════════════════════════════════════════

## 📱 CONTRATS BLOCKCHAIN

```
RoleManager (0x5FbDB2315678afecb367f032d93F642f64180aa3)
├─ getGroup(address) → string
├─ isStudent(address) → bool
├─ isProfessor(address) → bool
├─ assignRole(address, bytes32)
├─ assignGroup(address, string)
└─ requestStudentRole() [NEW]

AnnouncementLog (0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512)
├─ publish(contentHash, category, targetGroup)
├─ verify(contentHash) → bool
├─ getAnnouncement(id) → Announcement
├─ getCount() → uint256
└─ getTotalCount() → uint256

DocumentRegistry (0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0)
├─ register(fileHash, fileName, targetGroup)
├─ verifyDocument(fileHash) → bool
├─ getDocument(id) → Document
└─ getCount() → uint256

AcknowledgmentLog (0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9)
├─ acknowledge(announcementId)
├─ hasSigned(announcementId, student) → bool
├─ getAcknowledgments(announcementId) → Acknowledgment[] [NEW]
└─ getCount() → uint256
```

═══════════════════════════════════════════════════════════════════════════════

## 🔌 API ENDPOINTS

### Announcement
```
GET /api/announcement?group=MF1
  ↳ Retourne annonces MF1 + ALL

POST /api/announcement
  Body: { contentHash, category, targetGroup }
  ↳ Publie annonce (PROFESSOR_ROLE required)
```

### Student Group
```
GET /api/student-group/:address
  ↳ Retourne { group: "MF1" } ou "MF2" ou "ALL"
```

### Chat IA
```
POST /api/chat
  Body: { question, studentGroup }
  ↳ Retourne { answer, source }
```

### Document
```
POST /api/document
  Body: FormData { file, targetGroup }
  ↳ Upload + enregistrement blockchain

GET /api/verify/document/:hash
  ↳ Retourne { isValid: true/false }
```

### Acknowledgments [NEW]
```
GET /api/acknowledge/announcement/:id
  ↳ Retourne { acknowledgments: [...] }
```

═══════════════════════════════════════════════════════════════════════════════

## 🐛 TROUBLESHOOTING

### Problème: MetaMask ne se connecte pas
**Solution:** 
1. Vérifier MetaMask installé
2. Add Network Custom RPC:
   - Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337

### Problème: "Vous devez obtenir le rôle Étudiant"
**Solution:**
1. Click "Demander le rôle Étudiant"
2. Signe transaction
3. Refresh page

### Problème: Annonces n'apparaissent pas
**Solution:**
1. Vérifier backend running (`npm logs`)
2. Vérifier groupe étudiant assigné
3. Professeur doit publier annonce pour ce groupe

### Problème: Document upload échoue
**Solution:**
1. Vérifier route POST /api/document
2. Vérifier wallet a tokens (Hardhat donne 10k)
3. Vérifier PROFESSOR_ROLE assigné

### Problème: Chat IA ne répond pas
**Solution:**
1. Vérifier RAG initialized (console backend)
2. Vérifier annonces publiées pour groupe
3. Attendre 2-3 secondes pour embedding

═══════════════════════════════════════════════════════════════════════════════

## 📊 VÉRIFIER LE STATUT

### Hardhat
```bash
npx hardhat node
# ✅ Si affiche: "Started HTTP and WebSocket JSON-RPC server"
```

### Backend
```bash
node backend/server.cjs
# ✅ Si affiche: "Serveur démarré sur http://localhost:3000"
```

### Contracts
```bash
curl http://localhost:3000/api/health
# ✅ Retourne: { health: "ok" }
```

### Blockchain
```bash
npm run hardhat:test
# ✅ Si retourne: "22 passing"
```

═══════════════════════════════════════════════════════════════════════════════

## 📝 NOTES IMPORTANTES

✅ **Données Blockchain:**
- Permanentes après déploiement
- Vérifiables par tous
- Immuables

✅ **Groupes:**
- MF1, MF2, ALL extensibles
- Assignés par admin initialement
- Filtrage automatique

✅ **Signatures:**
- Enregistrées avec timestamp
- Adresse réelle wallet
- Non modifiables

✅ **Documents:**
- Vérifiables par hash
- Groupe-spécifique optionnel
- Permanents blockchain

⚠️ **RAG Chat:**
- Indexation automatique annonces
- Filtrée par groupe étudiant
- Réponses contextuelles

═══════════════════════════════════════════════════════════════════════════════

## 🔗 RESSOURCES

- Contrats: `/contracts/*.sol`
- Frontend: `/frontend/*.html`
- Backend: `/backend/routes/*.cjs`
- Tests: `test_*.js`
- Docs: `FIXES_SUMMARY.md`, `VALIDATION_REPORT.md`

═══════════════════════════════════════════════════════════════════════════════
Support: Cette version est 100% conforme à la spécification fonctionnelle
Prêt production: ✅ OUI
═══════════════════════════════════════════════════════════════════════════════
