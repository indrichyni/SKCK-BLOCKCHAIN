// enrollUser1.js
const fs = require("fs");
const path = require("path");
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

const ccpPath = path.resolve(__dirname, "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

async function main() {
  try {
    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    const ca = new FabricCAServices(caInfo.url, {
      trustedRoots: caInfo.tlsCACerts.path,
      verify: false
    });

    const walletPath = path.join(__dirname, "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Enrollment user1 langsung
    const enrollment = await ca.enroll({
      enrollmentID: "user1",
      enrollmentSecret: "user1pw" // ⚠️ default secret saat register pertama kali
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: "Org1MSP",
      type: "X.509"
    };

    await wallet.put("user1", x509Identity);
    console.log("✅ Enrolled user1 again and added to wallet");

  } catch (error) {
    console.error("❌ Failed to enroll user1 again:", error);
  }
}

main();
