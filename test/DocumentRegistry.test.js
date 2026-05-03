const { expect } = require("chai");
const hre = require("hardhat");

describe("DocumentRegistry", function () {
  let documentRegistry;
  let admin, professor, student;

  const FILE_HASH = "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";
  const FAKE_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

  beforeEach(async function () {
    [admin, professor, student] = await hre.ethers.getSigners();
    const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
    documentRegistry = await DocumentRegistry.deploy();
    await documentRegistry.waitForDeployment();

    const PROFESSOR_ROLE = await documentRegistry.PROFESSOR_ROLE();
    await documentRegistry.connect(admin).grantRole(PROFESSOR_ROLE, professor.address);
  });

  it("Un professeur peut enregistrer un document", async function () {
    await documentRegistry.connect(professor).register(FILE_HASH, "cours.pdf", "MF1");
    expect(await documentRegistry.verifyDocument(FILE_HASH)).to.equal(true);
  });

  it("Un étudiant NE PEUT PAS enregistrer un document", async function () {
    await expect(
      documentRegistry.connect(student).register(FILE_HASH, "cours.pdf", "MF1")
    ).to.be.reverted;
  });

  it("verifyDocument() retourne true pour un hash qui existe", async function () {
    await documentRegistry.connect(professor).register(FILE_HASH, "exo.pdf", "ALL");
    expect(await documentRegistry.verifyDocument(FILE_HASH)).to.equal(true);
  });

  it("verifyDocument() retourne false pour un hash inconnu", async function () {
    expect(await documentRegistry.verifyDocument(FAKE_HASH)).to.equal(false);
  });

  it("getDocument() retourne les bonnes données", async function () {
    await documentRegistry.connect(professor).register(FILE_HASH, "cours.pdf", "MF2");
    const doc = await documentRegistry.getDocument(0);
    expect(doc.fileHash).to.equal(FILE_HASH);
    expect(doc.fileName).to.equal("cours.pdf");
    expect(doc.targetGroup).to.equal("MF2");
  });
});