// backend/routes/applicant.js
const express = require("express");
const multer = require("multer");
const { uploadToIPFS } = require("../services/ipfsService");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { nama, nik, tujuan } = req.body;
    const filePath = req.file.path;

    // Upload ke IPFS
    const ipfsResult = await uploadToIPFS(filePath);
    const ipfsHash = ipfsResult.cid.toString();

    // Hapus file lokal
    fs.unlinkSync(filePath);

    // Buat ID SKCK unik
    const id = "SKCK" + Date.now();
    console.log("📤 Mengirim ke riwayatPengajuan:", { id, nama, nik, tujuan });

    // Simpan ke riwayat pengajuan
    //await axios.post("http://localhost:3000/api/skck/riwayatPengajuan", {
      //id,
      //nama,
      //nik,
      //tujuan
    //}).then(() => {
      //console.log("✅ Data berhasil dikirim ke riwayatPengajuan");
    //}).catch((err) => {
      //console.error("❌ Gagal kirim ke riwayatPengajuan:", err.message);
    //});

    // Kirim respons ke frontend
    res.json({
      message: "✅ Bukti bayar berhasil diupload ke IPFS & disimpan sebagai pengajuan",
      id,
      nama,
      nik,
      tujuan,
      ipfsHash
    });
  } catch (err) {
    console.error("❌ Gagal upload bukti bayar:", err);
    res.status(500).json({ error: "Gagal upload bukti bayar" });
  }
});

module.exports = router;
