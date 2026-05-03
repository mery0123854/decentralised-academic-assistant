const { expect } = require("chai");
const hre = require("hardhat");

describe("RoleManager", function () {
  let roleManager;
  let admin, professor, student, other;

  beforeEach(async function () {
    [admin, professor, student, other] = await hre.ethers.getSigners();
    const RoleManager = await hre.ethers.getContractFactory("RoleManager");
    roleManager = await RoleManager.deploy();
    await roleManager.waitForDeployment();
  });

  it("Le déployeur est admin", async function () {
    const ADMIN_ROLE = await roleManager.DEFAULT_ADMIN_ROLE();
    expect(await roleManager.hasRole(ADMIN_ROLE, admin.address)).to.equal(true);
  });

  it("L'admin peut assigner le rôle PROFESSOR", async function () {
    const PROFESSOR_ROLE = await roleManager.PROFESSOR_ROLE();
    await roleManager.connect(admin).assignRole(professor.address, PROFESSOR_ROLE);
    expect(await roleManager.isProfessor(professor.address)).to.equal(true);
  });

  it("L'admin peut assigner le rôle STUDENT", async function () {
    const STUDENT_ROLE = await roleManager.STUDENT_ROLE();
    await roleManager.connect(admin).assignRole(student.address, STUDENT_ROLE);
    expect(await roleManager.isStudent(student.address)).to.equal(true);
  });

  it("Un non-admin NE PEUT PAS assigner de rôle", async function () {
    const PROFESSOR_ROLE = await roleManager.PROFESSOR_ROLE();
    await expect(
      roleManager.connect(other).assignRole(professor.address, PROFESSOR_ROLE)
    ).to.be.reverted;
  });

  it("L'admin peut assigner un groupe à un étudiant", async function () {
    const STUDENT_ROLE = await roleManager.STUDENT_ROLE();
    await roleManager.connect(admin).assignRole(student.address, STUDENT_ROLE);
    await roleManager.connect(admin).assignGroup(student.address, "MF1");
    expect(await roleManager.getGroup(student.address)).to.equal("MF1");
  });

  it("On NE PEUT PAS assigner un groupe à un non-étudiant", async function () {
    await expect(
      roleManager.connect(admin).assignGroup(professor.address, "MF1")
    ).to.be.reverted;
  });
});