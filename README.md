# 🚔 SKCK Blockchain System 

![Hyperledger Fabric](https://img.shields.io/badge/Blockchain-Hyperledger%20Fabric-blue?style=flat-square)
![IPFS](https://img.shields.io/badge/Storage-IPFS-purple?style=flat-square)

> **Sistem pengelolaan Surat Keterangan Catatan Kepolisian (SKCK)** berbasis **Blockchain Hyperledger Fabric** dan **IPFS**, studi kasus di Polres Klungkung. Mendukung tiga peran: **Pemohon**, **Kepolisian**, dan **Perusahaan/Verifier**.

---

## 🗂️ Struktur Folder

```bash
skck-blockchain/
├── skck-network/
│   └── fabric-samples/
│       └── chaincode/
│           ├── index.js
│           ├── lib/
│           │   └── SKCKContract.js
│           ├── package.json
├── backend/        # ExpressJS API (Opsional)
├── frontend/       # ReactJS + Tailwind (Opsional)
└── README.md
```

---

## 🛠️ Fitur Utama

- ✅ Pemohon mengisi data SKCK
- ✅ Polisi memverifikasi dan mengunggah SKCK ke IPFS
- ✅ Data hash IPFS disimpan ke blockchain
- ✅ Perusahaan dapat memverifikasi keaslian SKCK berdasarkan NIK
- ✅ Data terenkripsi, transparan, dan tidak dapat diubah

---

## ⚙️ Teknologi yang Digunakan

| Komponen           | Teknologi                        |
|--------------------|----------------------------------|
| Blockchain         | Hyperledger Fabric               |
| Penyimpanan File   | IPFS (InterPlanetary File System)|
| Backend API        | Node.js + Express.js             |
| Frontend UI        | React.js + Tailwind CSS          |
| Versi Kontrol      | Git + GitHub                     |

---

## 🚀 Cara Menjalankan Sistem

### 1. Clone repository

```bash
git clone https://github.com/indrichyni/SKCK-BLOCKCHAIN.git
cd SKCK-BLOCKCHAIN
```

### 2. Menjalankan Hyperledger Fabric

```bash
cd skck-network/fabric-samples
./network.sh up createChannel -ca
./network.sh deployCC -ccn skck -ccp ./chaincode -ccl javascript
```

### 3. Menjalankan Backend & Frontend (jika ada)

```bash
cd backend
npm install
npm start
```

```bash
cd frontend
npm install
npm start
```

---

## 📌 Studi Kasus

- **Lokasi:** Kepolisian Resor Klungkung, Bali  
- **Tujuan:** Digitalisasi SKCK agar lebih aman, cepat, dan transparan  
- **Metode:** Design Science Research (DSR)

---

## 📷 Tampilan Sistem



---

## 🤝 Kontribusi

Terbuka untuk kolaborasi dan kontribusi. Silakan buat pull request atau hubungi saya melalui GitHub.

---

## 👩‍💻 Author

**Indri Cahyani**  
Teknologi Informasi, Universitas Udayana  
GitHub: [@indrichyni](https://github.com/indrichyni)
