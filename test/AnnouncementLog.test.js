const { expect } = require("chai");
const hre = require("hardhat");

describe("AnnouncementLog", function () {
  let announcementLog;
  let admin, professor, student;

  const HASH1 = "abc123def456abc123def456abc123def456abc123def456abc123def456abc1";
  const HASH2 = "999888777666555444333222111000aaabbbccc123456789abcdef0123456789";

  beforeEach(async function () {
    [admin, professor, student] = await hre.ethers.getSigners();
    const AnnouncementLog = await hre.ethers.getContractFactory("AnnouncementLog");
    announcementLog = await AnnouncementLog.deploy();
    await announcementLog.waitForDeployment();

    const PROFESSOR_ROLE = await announcementLog.PROFESSOR_ROLE();
    await announcementLog.connect(admin).grantRole(PROFESSOR_ROLE, professor.address);
  });

  it("Un professeur peut publier une annonce", async function () {
    await announcementLog.connect(professor).publish(HASH1, "examen", "MF1");
    expect(await announcementLog.verify(HASH1)).to.equal(true);
  });

  it("Un étudiant NE PEUT PAS publier", async function () {
    await expect(
      announcementLog.connect(student).publish(HASH1, "examen", "MF1")
    ).to.be.reverted;
  });

  it("verify() retourne true pour un hash qui existe", async function () {
    await announcementLog.connect(professor).publish(HASH1, "cours", "ALL");
    expect(await announcementLog.verify(HASH1)).to.equal(true);
  });

  it("verify() retourne false pour un hash inexistant", async function () {
    expect(await announcementLog.verify(HASH2)).to.equal(false);
  });

  it("getCount() retourne le bon nombre d'annonces", async function () {
    await announcementLog.connect(professor).publish(HASH1, "examen", "MF1");
    await announcementLog.connect(professor).publish(HASH2, "devoir", "MF2");
    expect(await announcementLog.getCount()).to.equal(2n);
  });

  it("getAnnouncement() retourne les bonnes données", async function () {
    await announcementLog.connect(professor).publish(HASH1, "examen", "MF1");
    const ann = await announcementLog.getAnnouncement(0);
    expect(ann.contentHash).to.equal(HASH1);
    expect(ann.targetGroup).to.equal("MF1");
    expect(ann.publisher).to.equal(professor.address);
  });
});