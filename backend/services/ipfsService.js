const { create } = require("ipfs-http-client");
const fs = require("fs");

// Koneksi ke IPFS (gunakan Docker port 5001)
const ipfs = create({ url: "http://localhost:5001" });

async function uploadToIPFS(filePath) {
  const file = fs.readFileSync(filePath);
  const result = await ipfs.add(file);
  return result;
}

module.exports = { uploadToIPFS };
