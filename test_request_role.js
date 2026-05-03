const hre = require("hardhat");

async function main() {
  const [deployer, student1, student2] = await hre.ethers.getSigners();
  
  console.log("🚀 Redeploying contracts...");
  
  // Deploy RoleManager
  const RoleManager = await hre.ethers.getContractFactory("RoleManager");
  const roleManager = await RoleManager.deploy();
  await roleManager.waitForDeployment();
  
  console.log("🧪 Test requestStudentRole()");
  
  // Check initial state
  let isStudent = await roleManager.isStudent(student1.address);
  console.log(`1. Student1 is student? ${isStudent} (should be false)`);
  
  // Request role
  try {
    const tx = await roleManager.connect(student1).requestStudentRole();
    await tx.wait();
    console.log("✅ requestStudentRole() called successfully");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
  
  // Check new state
  isStudent = await roleManager.isStudent(student1.address);
  console.log(`2. Student1 is student? ${isStudent} (should be true)`);
  
  // Try to request again (should fail)
  try {
    const tx2 = await roleManager.connect(student1).requestStudentRole();
    await tx2.wait();
    console.log("❌ Should have failed but didn't!");
  } catch (err) {
    console.log("✅ Correctly rejected duplicate request");
  }
}

main().catch(console.error);
