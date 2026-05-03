// backend/blockchain/client.cjs
const { createPublicClient, createWalletClient, http } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const fs = require("fs");
const path = require("path");

const addrPath = path.join(__dirname, "../../contract-addresses.json");
let addresses;
try {
  addresses = JSON.parse(fs.readFileSync(addrPath, "utf8"));
  console.log("✅ contract-addresses.json chargé");
} catch {
  console.error("❌ contract-addresses.json introuvable");
  process.exit(1);
}

const hardhatChain = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
};

const DEFAULT_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const defaultAccount = privateKeyToAccount(DEFAULT_PRIVATE_KEY);

const publicClient = createPublicClient({
  chain: hardhatChain,
  transport: http("http://127.0.0.1:8545"),
});

const walletClient = createWalletClient({
  chain: hardhatChain,
  transport: http("http://127.0.0.1:8545"),
  account: defaultAccount,
});

// ABIs
const announcementLogAbi = [
  {
    type: "function",
    name: "publish",
    inputs: [
      { name: "contentHash", type: "string" },
      { name: "category", type: "string" },
      { name: "targetGroup", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verify",
    inputs: [{ name: "contentHash", type: "string" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
];

const documentRegistryAbi = [
  {
    type: "function",
    name: "register",
    inputs: [
      { name: "fileHash", type: "string" },
      { name: "fileName", type: "string" },
      { name: "targetGroup", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyDocument",
    inputs: [{ name: "fileHash", type: "string" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDocument",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{
      name: "",
      type: "tuple",
      components: [
        { name: "id", type: "uint256" },
        { name: "fileHash", type: "string" },
        { name: "fileName", type: "string" },
        { name: "targetGroup", type: "string" },
        { name: "timestamp", type: "uint256" },
        { name: "uploader", type: "address" }
      ]
    }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
];

const acknowledgmentLogAbi = [
  {
    type: "function",
    name: "acknowledge",
    inputs: [{ name: "announcementId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasSigned",
    inputs: [
      { name: "announcementId", type: "uint256" },
      { name: "student", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAcknowledgments",
    inputs: [{ name: "announcementId", type: "uint256" }],
    outputs: [{
      name: "",
      type: "tuple[]",
      components: [
        { name: "announcementId", type: "uint256" },
        { name: "student", type: "address" },
        { name: "timestamp", type: "uint256" }
      ]
    }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
];

const roleManagerAbi = [
  {
    type: "function",
    name: "getGroup",
    inputs: [{ name: "student", type: "address" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isStudent",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "requestStudentRole",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

module.exports = {
  addresses,
  publicClient,
  walletClient,
  defaultAccount,
  announcementLogAbi,
  documentRegistryAbi,
  acknowledgmentLogAbi,
  roleManagerAbi,
};