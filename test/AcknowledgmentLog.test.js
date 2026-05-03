const { expect } = require("chai");
const hre = require("hardhat");

describe("AcknowledgmentLog", function () {
  let acknowledgmentLog;
  let admin, student1, student2, professor;

  beforeEach(async function () {
    [admin, student1, student2, professor] = await hre.ethers.getSigners();
    const AcknowledgmentLog = await hre.ethers.getContractFactory("AcknowledgmentLog");
    acknowledgmentLog = await AcknowledgmentLog.deploy();
    await acknowledgmentLog.waitForDeployment();

    const STUDENT_ROLE = await acknowledgmentLog.STUDENT_ROLE();
    await acknowledgmentLog.connect(admin).grantRole(STUDENT_ROLE, student1.address);
  });

  it("Un étudiant peut signer 'J'ai lu'", async function () {
    await acknowledgmentLog.connect(student1).acknowledge(0);
    expect(await acknowledgmentLog.hasSigned(0, student1.address)).to.equal(true);
  });

  it("Un professeur (sans rôle étudiant) NE PEUT PAS signer", async function () {
    await expect(
      acknowledgmentLog.connect(professor).acknowledge(0)
    ).to.be.reverted;
  });

  it("hasSigned() retourne false si pas encore signé", async function () {
    expect(await acknowledgmentLog.hasSigned(0, student1.address)).to.equal(false);
  });

  it("Un étudiant ne peut PAS signer deux fois la même annonce", async function () {
    await acknowledgmentLog.connect(student1).acknowledge(0);
    await expect(
      acknowledgmentLog.connect(student1).acknowledge(0)
    ).to.be.reverted;
  });

  it("student2 (sans rôle) NE PEUT PAS signer", async function () {
    await expect(
      acknowledgmentLog.connect(student2).acknowledge(0)
    ).to.be.reverted;
  });
});