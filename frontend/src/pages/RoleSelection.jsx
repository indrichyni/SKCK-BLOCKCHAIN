import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Pengaju SKCK",
      description: "Isi data diri & unggah bukti pembayaran.",
      icon: <FaUserAlt className="text-blue-500 text-3xl mb-2" />,
      route: "/pengaju",
    },
    {
      title: "Polisi",
      description: "Verifikasi data dan unggah SKCK resmi.",
      icon: <FaShieldAlt className="text-green-600 text-3xl mb-2" />,
      route: "/polisi",
    },
    {
      title: "Verifikator",
      description: "Cek status & validitas SKCK dari IPFS.",
      icon: <FaCheckCircle className="text-yellow-500 text-3xl mb-2" />,
      route: "/verifikator",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Sistem SKCK Terdesentralisasi</h1>
        <p className="text-gray-600 text-sm">
          Aplikasi berbasis Blockchain + IPFS untuk pengajuan dan verifikasi SKCK secara aman & transparan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map((role, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer text-center"
            onClick={() => navigate(role.route)}
          >
            <div className="flex justify-center">{role.icon}</div>
            <h3 className="text-xl font-semibold text-gray-700 mt-2">{role.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm"
              onClick={() => navigate(role.route)}
            >
              Masuk
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleSelection;
