const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadToIPFS } = require("../services/ipfsService");

const router = express.Router();

// Setup multer untuk upload file
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // pakai timestamp
  },
});
const upload = multer({ storage });

// Endpoint: POST /api/skck/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ipfsResult = await uploadToIPFS(filePath);

    res.json({
      message: "Berhasil upload ke IPFS",
      ipfsHash: ipfsResult.cid.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal upload ke IPFS" });
  }
});

module.exports = router;
