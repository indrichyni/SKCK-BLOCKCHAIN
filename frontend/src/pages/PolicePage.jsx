// src/pages/PolicePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrashAlt } from "react-icons/fa";

function PolicePage() {
  const [activeTab, setActiveTab] = useState("riwayat");
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    nik: "",
    tujuan: "",
    file: null,
  });

  const [ipfsHash, setIpfsHash] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    if (activeTab === "riwayat") {
      axios
        .get("http://localhost:3000/api/skck/riwayatPengajuan")
        .then((res) => setRiwayat(res.data))
        .catch((err) => console.error("❌ Gagal ambil riwayat:", err));
    }
  }, [activeTab]);

  const handleStatusChange = (id, status) => {
    axios
      .patch(`http://localhost:3000/api/skck/riwayatPengajuan/${id}`, { status })
      .then(() => {
        setRiwayat((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      })
      .catch((err) => console.error("❌ Gagal ubah status:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus pengajuan ini?")) {
      axios
        .delete(`http://localhost:3000/api/skck/riwayatPengajuan/${id}`)
        .then(() => {
          setRiwayat((prev) => prev.filter((item) => item.id !== id));
        })
        .catch((err) => console.error("❌ Gagal menghapus:", err));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    if (!formData.id.trim()) return "ID tidak boleh kosong.";
    if (!formData.nama.trim()) return "Nama tidak boleh kosong.";
    if (!/^\d{16}$/.test(formData.nik)) return "NIK harus 16 digit.";
    if (!formData.tujuan.trim()) return "Tujuan tidak boleh kosong.";
    if (!formData.file) return "File harus diunggah.";
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(formData.file.type)) return "Format file tidak valid.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIpfsHash("");
    const validationError = validateForm();
    if (validationError) {
      setError(`⚠️ ${validationError}`);
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const res = await axios.post("http://localhost:3000/api/skck-bc/upload", data);
      setIpfsHash(res.data.ipfsHash);
    } catch (err) {
      console.error("❌ Gagal upload:", err);
      setError("❌ Gagal upload SKCK");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-700 to-blue-900 px-4 py-10 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 shadow-2xl border border-white/20 rounded-3xl max-w-4xl w-full p-6 md:p-10 text-white">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "riwayat"
                ? "bg-blue-600 text-white"
                : "bg-white/30 text-white hover:bg-blue-600"
            }`}
            onClick={() => setActiveTab("riwayat")}
          >
            Lihat Pengaju
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "bg-white/30 text-white hover:bg-blue-600"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload SKCK
          </button>
        </div>

        {activeTab === "riwayat" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Riwayat Pengajuan SKCK</h2>
            {riwayat.length === 0 ? (
              <p className="text-gray-300">Belum ada pengajuan.</p>
            ) : (
              <ul className="space-y-4">
                {riwayat.map((item) => (
                  <li
                    key={item.id}
                    className="border border-white/20 p-4 rounded-xl bg-white/20 backdrop-blur text-white"
                  >
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Nama:</strong> {item.nama}</p>
                    <p><strong>NIK:</strong> {item.nik}</p>
                    <p><strong>Tujuan:</strong> {item.tujuan}</p>

                    {item.ipfsHash && (
                      <p className="text-sm mt-2">
                        📎 Bukti Bayar:&nbsp;
                        <a
                          href={`http://localhost:8080/ipfs/${item.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-200 hover:text-blue-100"
                        >
                          Lihat file di IPFS
                        </a>
                      </p>
                    )}

                    <p className="flex items-center gap-2 mt-2">
                      <strong>Status:</strong>
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold flex items-center gap-1 ${
                          item.status === "Menunggu"
                            ? "bg-gray-500"
                            : item.status === "Sedang Diproses"
                            ? "bg-yellow-400 text-black"
                            : item.status === "Selesai"
                            ? "bg-green-600"
                            : item.status === "Ditolak"
                            ? "bg-red-600"
                            : "bg-gray-300"
                        }`}
                      >
                        {item.status === "Menunggu" && "⏳"}
                        {item.status === "Sedang Diproses" && "🔄"}
                        {item.status === "Selesai" && "✅"}
                        {item.status === "Ditolak" && "❌"}
                        {item.status}
                      </span>
                    </p>

                    {item.createdAt && (
                      <p className="text-sm text-gray-200 italic mt-1">
                        🕒 Diajukan pada:{" "}
                        {new Date(item.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}

                    <select
                      className="mt-3 border px-3 py-2 rounded-lg bg-white text-gray-800"
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option>Menunggu</option>
                      <option>Sedang Diproses</option>
                      <option>Selesai</option>
                      <option>Ditolak</option>
                    </select>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="mt-3 flex items-center gap-2 text-red-300 hover:text-red-100 transition text-sm"
                    >
                      <FaTrashAlt className="text-base" />
                      Hapus Pengajuan
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "upload" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">Upload SKCK Resmi</h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              {["id", "nama", "nik", "tujuan"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.toUpperCase()}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 placeholder-gray-500"
                />
              ))}

              {/* Custom Upload */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="skckFile"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg cursor-pointer font-medium"
                >
                  📤 Pilih File SKCK
                </label>
                <input
                  id="skckFile"
                  type="file"
                  name="file"
                  onChange={handleChange}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                {formData.file && (
                  <p className="text-sm text-blue-200 italic">
                    📎 File dipilih: {formData.file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold ${
                  loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Mengunggah..." : "Upload SKCK"}
              </button>
            </form>

            {loading && <LoadingSpinner />}
            {error && <p className="text-red-300 mt-4">{error}</p>}

            {ipfsHash && (
              <div className="mt-6 bg-white/20 p-4 rounded shadow text-white">
                <p className="text-green-300 font-bold">✅ Berhasil diupload ke IPFS</p>
                <p><strong>Hash:</strong> {ipfsHash}</p>
                <a
                  href={`http://localhost:8080/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 underline"
                >
                  Lihat file
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PolicePage;
