// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Déploiement des 4 contrats...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📋 Compte déployeur : ${deployer.address}\n`);

  // 1. RoleManager
  const RoleManager = await hre.ethers.getContractFactory("RoleManager");
  const roleManager = await RoleManager.deploy();
  await roleManager.waitForDeployment();
  const roleManagerAddr = await roleManager.getAddress();
  console.log(`✅ RoleManager        : ${roleManagerAddr}`);

  // 2. AnnouncementLog
  const AnnouncementLog = await hre.ethers.getContractFactory("AnnouncementLog");
  const announcementLog = await AnnouncementLog.deploy();
  await announcementLog.waitForDeployment();
  const announcementLogAddr = await announcementLog.getAddress();
  console.log(`✅ AnnouncementLog    : ${announcementLogAddr}`);

  // 3. DocumentRegistry
  const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
  const documentRegistry = await DocumentRegistry.deploy();
  await documentRegistry.waitForDeployment();
  const documentRegistryAddr = await documentRegistry.getAddress();
  console.log(`✅ DocumentRegistry   : ${documentRegistryAddr}`);

  // 4. AcknowledgmentLog
  const AcknowledgmentLog = await hre.ethers.getContractFactory("AcknowledgmentLog");
  const acknowledgmentLog = await AcknowledgmentLog.deploy();
  await acknowledgmentLog.waitForDeployment();
  const acknowledgmentLogAddr = await acknowledgmentLog.getAddress();
  console.log(`✅ AcknowledgmentLog  : ${acknowledgmentLogAddr}`);

  // 5. Récupérer les rôles
  const PROFESSOR_ROLE = await announcementLog.PROFESSOR_ROLE();
  const STUDENT_ROLE = await roleManager.STUDENT_ROLE();

  // 6. Accorder les rôles
  await announcementLog.grantRole(PROFESSOR_ROLE, deployer.address);
  await documentRegistry.grantRole(PROFESSOR_ROLE, deployer.address);
  await acknowledgmentLog.grantRole(STUDENT_ROLE, deployer.address);
  
  // 👇 Ajouter le rôle STUDENT à quelques comptes étudiants (Account #1, #2)
  const students = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Account #1
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"  // Account #2
  ];
  
  for (const student of students) {
    await acknowledgmentLog.grantRole(STUDENT_ROLE, student);
    console.log(`🔑 Rôle STUDENT accordé à ${student}`);
  }
  
  console.log(`\n🔑 Rôle PROFESSOR accordé au déployeur`);
  console.log(`🔑 Rôle STUDENT accordé au déployeur (pour test)`);

  // 7. Sauvegarder les adresses
  const addresses = {
    deployer: deployer.address,
    roleManager: roleManagerAddr,
    announcementLog: announcementLogAddr,
    documentRegistry: documentRegistryAddr,
    acknowledgmentLog: acknowledgmentLogAddr,
    PROFESSOR_ROLE: PROFESSOR_ROLE,
    STUDENT_ROLE: STUDENT_ROLE,
  };

  fs.writeFileSync(
    path.join(__dirname, "../contract-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n💾 Adresses sauvegardées dans contract-addresses.json");
  console.log("=".repeat(55));
  console.log("🎉 DÉPLOIEMENT TERMINÉ !");
}

main().catch((err) => {
  console.error("❌ Erreur :", err);
  process.exitCode = 1;
});