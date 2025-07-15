const fs = require("fs");
const path = require("path");
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

const ccpPath = path.resolve(__dirname, "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

async function main() {
  try {
    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    const caURL = caInfo.url;
    const caTLSCACertsPath = path.resolve(__dirname, caInfo.tlsCACerts.path);
    const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);

    const ca = new FabricCAServices(caURL, {
      trustedRoots: caTLSCACerts,
      verify: false
    }, caInfo.caName);

    const walletPath = path.join(__dirname, "wallet");
    console.log(`📁 Wallet path: ${walletPath}`);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userId = "user2"; // 🔄 Ganti ID user di sini

    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`✅ ${userId} identity already exists in the wallet`);
      return;
    }

    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log("❌ Admin identity not found in the wallet");
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    const secret = await ca.register({
      affiliation: "org1.department1", // Sesuaikan jika CA tidak pakai department
      enrollmentID: userId,
      role: "client"
    }, adminUser);

    const enrollment = await ca.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: "Org1MSP",
      type: "X.509"
    };

    await wallet.put(userId, x509Identity);
    console.log(`✅ Successfully registered and enrolled ${userId}`);
  } catch (error) {
    console.error("❌ Failed to register user:", error);
  }
}

main();
