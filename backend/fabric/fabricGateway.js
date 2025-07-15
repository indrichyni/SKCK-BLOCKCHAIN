// backend/fabric/fabricGateway.js
const path = require("path");
const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");

const ccpPath = path.resolve(__dirname, "connection-org1.json");
const walletPath = path.resolve(__dirname, "wallet");

async function connectToNetwork(userId) {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true } // 🔧 DISABLED discovery
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("skck");

  return contract;
}

module.exports = { connectToNetwork };
