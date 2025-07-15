const fs = require("fs");
const path = require("path");
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

const ccpPath = path.resolve(__dirname, "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

async function main() {
  try {
    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    const walletPath = path.join(__dirname, "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("admin");
    if (identity) {
      console.log("✅ Admin identity already exists in the wallet");
      return;
    }

    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    await wallet.put("admin", x509Identity);
    console.log("✅ Successfully enrolled admin and imported to wallet");
  } catch (error) {
    console.error("❌ Failed to enroll admin:", error);
  }
}

main();
