const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadToIPFS } = require("../services/ipfsService");
const { connectToNetwork } = require("../fabric/fabricGateway");

const router = express.Router();

// Setup upload file dengan multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ==== [POST] Upload SKCK ke IPFS + Simpan ke Blockchain ====
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { id, nama, nik, tujuan } = req.body;

    if (!id || !nama || !nik || !tujuan) {
      return res.status(400).json({ error: "Semua field wajib diisi (id, nama, nik, tujuan)" });
    }

    const filePath = req.file.path;
    const ipfsResult = await uploadToIPFS(filePath);
    const ipfsHash = ipfsResult.cid.toString();

    const contract = await connectToNetwork("user1");

    const result = await contract.submitTransaction(
      "createSKCK",
      id,
      nama,
      nik,
      tujuan,
      ipfsHash
    );

    fs.unlinkSync(filePath);

    res.json({
      message: "✅ SKCK berhasil disimpan",
      ipfsHash,
      blockchainResult: JSON.parse(result.toString()),
    });
  } catch (error) {
    console.error("❌ Gagal upload SKCK:", error);
    res.status(500).json({ error: "Gagal menyimpan SKCK" });
  }
});

// ==== [GET] Ambil SKCK berdasarkan ID ====
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await connectToNetwork("user1");

    const result = await contract.evaluateTransaction("readSKCK", id);
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    console.error("❌ Gagal ambil SKCK:", error);
    res.status(500).json({ error: "Data tidak ditemukan atau gagal dibaca" });
  }
});

module.exports = router;
