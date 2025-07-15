import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

function FormApplicant() {
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    tujuan: "",
    file: null,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    if (!form.nama.trim()) return "Nama tidak boleh kosong.";
    if (!/^\d{16}$/.test(form.nik)) return "NIK harus terdiri dari 16 digit angka.";
    if (!form.tujuan.trim()) return "Tujuan tidak boleh kosong.";
    if (!form.file) return "File harus diunggah.";
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(form.file.type)) return "Tipe file harus PDF, JPG, JPEG, atau PNG.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const validationError = validateForm();
    if (validationError) {
      setError(`⚠️ ${validationError}`);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("nama", form.nama);
      data.append("nik", form.nik);
      data.append("tujuan", form.tujuan);
      data.append("file", form.file);

      // 1. Upload file ke IPFS
      const response = await axios.post("http://localhost:3000/api/pengajuan/submit", data);
      const { ipfsHash, id } = response.data;

      if (!ipfsHash || typeof ipfsHash !== "string" || ipfsHash.trim() === "" || !id) {
        throw new Error("IPFS upload gagal atau data tidak lengkap");
      }

      // Log untuk debugging
      console.log("📤 Mengirim ke riwayatPengajuan:", {
        id,
        nama: form.nama,
        nik: form.nik,
        tujuan: form.tujuan,
        ipfsHash,
      });

      // 2. Simpan ke riwayat pengajuan
      try {
        await axios.post("http://localhost:3000/api/skck/riwayatPengajuan", {
          id,
          nama: form.nama,
          nik: form.nik,
          tujuan: form.tujuan,
          ipfsHash,
        });
        console.log("✅ Berhasil kirim ke riwayatPengajuan");
      } catch (err) {
        if (err.response?.status === 409) {
          console.warn("⚠️ ID sudah ada. Melewati penyimpanan duplikat.");
        } else {
          throw err;
        }
      }

      setResult(response.data);
    } catch (err) {
      setError("❌ Gagal upload bukti pembayaran");
      console.error("❌ Error detail:", err?.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Form Pengajuan SKCK</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 digit)</label>
            <input
              type="text"
              name="nik"
              value={form.nik}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Pembuatan SKCK</label>
            <input
              type="text"
              name="tujuan"
              value={form.tujuan}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bukti Pembayaran</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
              className="block w-full border border-gray-300 file:px-4 file:py-2 file:border-none file:rounded-lg file:bg-blue-500 file:text-white file:cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </form>

        {loading && <LoadingSpinner />}

        {error && <p className="text-red-600 font-medium text-sm mt-4">{error}</p>}

        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-sm">
            <h3 className="text-green-700 font-bold mb-2">✅ Bukti berhasil diunggah</h3>
            <p className="text-sm"><strong>IPFS Hash:</strong> <code>{result.ipfsHash}</code></p>
            <p className="text-sm">
              Lihat file di IPFS:&nbsp;
              <a
                href={`http://localhost:8080/ipfs/${result.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {`http://localhost:8080/ipfs/${result.ipfsHash}`}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormApplicant;
