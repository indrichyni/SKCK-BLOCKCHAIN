const express = require("express");
const cors = require("cors");
const app = express();

const skckIPFSRoute = require("./routes/skck"); // hanya IPFS
const skckBlockchainRoute = require("./routes/skckBlockchain"); // IPFS + blockchain
const applicantRoute = require("./routes/applicant");
const riwayatPengajuanRoute = require("./routes/riwayatPengajuan"); // ✅ sesuai nama file kamu

// Middleware
app.use(cors());
app.use(express.json());

// Routing
app.use("/api/skck", skckIPFSRoute);                
app.use("/api/skck-bc", skckBlockchainRoute);       
app.use("/api/pengajuan", applicantRoute);          
app.use("/api/skck/riwayatPengajuan", riwayatPengajuanRoute); 

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
