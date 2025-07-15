const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const filePath = path.join(__dirname, "../data/riwayatPengajuan.json");

const load = () =>
  fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

const save = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// ✅ GET semua riwayat pengajuan
router.get("/", (req, res) => {
  const data = load();
  res.json(data);
});

// ✅ POST pengajuan baru (dipanggil dari frontend pengaju)
router.post("/", (req, res) => {
  const { id, nama, nik, tujuan, ipfsHash } = req.body;

  // 🛡️ Validasi lengkap
  if (!id || !nama || !nik || !tujuan || !ipfsHash || typeof ipfsHash !== "string" || ipfsHash.trim() === "") {
    console.error("❌ Gagal tambah riwayat: data tidak lengkap atau IPFS hash kosong");
    return res.status(400).json({ error: "Data tidak lengkap atau hash IPFS kosong" });
  }

  const data = load();
  const existing = data.find((d) => d.id === id);
  if (existing) {
    console.warn(`⚠️ ID sudah digunakan: ${id}`);
    return res.status(409).json({ error: "ID sudah digunakan" });
  }

  const newEntry = {
    id,
    nama,
    nik,
    tujuan,
    ipfsHash,
    status: "Menunggu",
    createdAt: new Date().toISOString()
  };

  data.push(newEntry);
  save(data);
  console.info(`✅ Riwayat pengajuan ditambahkan untuk ID: ${id}`);
  res.status(201).json({ message: "Berhasil ditambahkan", data: newEntry });
});

// ✅ PATCH ubah status pengajuan
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const data = load();
  const index = data.findIndex((d) => d.id === id);

  if (index === -1) {
    console.error(`❌ Tidak ditemukan ID: ${id}`);
    return res.status(404).json({ error: "Tidak ditemukan" });
  }

  data[index].status = status;
  save(data);
  console.info(`🔁 Status pengajuan ID ${id} diperbarui menjadi: ${status}`);
  res.json({ message: "Status diperbarui", data: data[index] });
});

// 🗑️ DELETE pengajuan berdasarkan ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const data = load();
  const newData = data.filter((d) => d.id !== id);

  if (newData.length === data.length) {
    console.warn(`⚠️ Tidak ada data yang dihapus. ID tidak ditemukan: ${id}`);
    return res.status(404).json({ error: "ID tidak ditemukan, tidak ada yang dihapus" });
  }

  save(newData);
  console.info(`🗑️ Pengajuan dengan ID ${id} berhasil dihapus`);
  res.json({ message: "Pengajuan berhasil dihapus" });
});

module.exports = router;
