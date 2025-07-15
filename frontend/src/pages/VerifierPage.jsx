import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

function VerifierPage() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ Tambahkan state loading

  const handleSearch = async () => {
    if (!searchId) {
      setError("⚠️ Masukkan ID SKCK");
      return;
    }

    try {
      setLoading(true); // ⬅️ Mulai spinner
      const res = await axios.get(`http://localhost:3000/api/skck-bc/${searchId}`);
      setResult(res.data);
      setError("");
    } catch (err) {
      setResult(null);
      setError("❌ SKCK tidak ditemukan");
    } finally {
      setLoading(false); // ⬅️ Selesai spinner
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Verifikasi SKCK</h2>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Masukkan ID SKCK"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Cari
          </button>
        </div>

        {loading && <LoadingSpinner />} {/* ⬅️ Spinner muncul di sini */}

        {error && <p className="text-red-600 font-medium text-sm mb-3">{error}</p>}

        {result && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm space-y-2">
            <p><span className="font-medium text-gray-700">Nama:</span> {result.nama}</p>
            <p><span className="font-medium text-gray-700">NIK:</span> {result.nik}</p>
            <p><span className="font-medium text-gray-700">Tujuan:</span> {result.tujuan}</p>
            <p>
              <span className="font-medium text-gray-700">Waktu Upload:</span>{" "}
              {new Date(result.timestamp).toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-gray-700">File SKCK (IPFS):</span>{" "}
              <a
                href={`http://localhost:8080/ipfs/${result.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-words"
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

export default VerifierPage;
