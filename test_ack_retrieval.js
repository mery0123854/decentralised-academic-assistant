const hre = require("hardhat");

async function main() {
  const [deployer, student1, student2] = await hre.ethers.getSigners();
  
  console.log("🚀 Redeploying contracts...");
  
  // Deploy contracts
  const AcknowledgmentLog = await hre.ethers.getContractFactory("AcknowledgmentLog");
  const acknowledgmentLog = await AcknowledgmentLog.deploy();
  await acknowledgmentLog.waitForDeployment();
  
  console.log("🧪 Test getAcknowledgments()");
  
  // Grant STUDENT_ROLE to students
  const studentRoleHash = await acknowledgmentLog.STUDENT_ROLE();
  
  const roleGrantTx1 = await acknowledgmentLog.grantRole(studentRoleHash, student1.address);
  await roleGrantTx1.wait();
  
  const roleGrantTx2 = await acknowledgmentLog.grantRole(studentRoleHash, student2.address);
  await roleGrantTx2.wait();
  
  console.log("✅ Student roles granted");
  
  // Students acknowledge announcement ID 0
  const ack1Tx = await acknowledgmentLog.connect(student1).acknowledge(BigInt(0));
  await ack1Tx.wait();
  console.log("✅ Student1 acknowledged");
  
  const ack2Tx = await acknowledgmentLog.connect(student2).acknowledge(BigInt(0));
  await ack2Tx.wait();
  console.log("✅ Student2 acknowledged");
  
  // Retrieve acknowledgments
  const acks = await acknowledgmentLog.getAcknowledgments(BigInt(0));
  console.log(`📋 Got ${acks.length} acknowledgments (should be 2)`);
  
  acks.forEach((ack, i) => {
    console.log(`  [${i}] Student: ${ack.student}, Timestamp: ${ack.timestamp}`);
  });
  
  if (acks.length === 2) {
    console.log("✅ getAcknowledgments() works correctly!");
  } else {
    console.log("❌ getAcknowledgments() returned wrong data");
  }
}

main().catch(console.error);
