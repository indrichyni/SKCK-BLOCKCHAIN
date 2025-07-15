import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserAlt, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import logoPolri from "../assets/logo-polri.png";
import bgPolres from "../assets/bg-polres.jpg"; // pastikan file ini ada di folder assets

export default function LandingPage() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Pengaju SKCK",
      description: "Isi data diri & unggah bukti pembayaran.",
      icon: <FaUserAlt className="text-blue-500 text-4xl mb-3" />,
      route: "/pengaju",
    },
    {
      title: "Polisi",
      description: "Verifikasi data dan unggah SKCK resmi.",
      icon: <FaShieldAlt className="text-green-600 text-4xl mb-3" />,
      route: "/polisi",
    },
    {
      title: "Verifikator",
      description: "Cek status & validitas SKCK dari IPFS.",
      icon: <FaCheckCircle className="text-yellow-500 text-4xl mb-3" />,
      route: "/verifikator",
    },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgPolres})` }}
      />

      {/* Blue Overlay */}
      <div className="absolute inset-0 bg-blue-900/85 z-0" />

      {/* Blob Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute bg-blue-400 opacity-35 rounded-full w-60 h-60 top-10 left-10 mix-blend-multiply filter blur-2xl animate-blob" />
        <div className="absolute bg-pink-400 opacity-20 rounded-full w-72 h-72 top-20 right-20 mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute bg-yellow-400 opacity-35 rounded-full w-64 h-64 bottom-10 left-1/3 mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute bg-green-400 opacity-30 rounded-full w-44 h-44 top-1/4 left-1/2 mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute bg-red-400 opacity-30 rounded-full w-52 h-52 bottom-1/3 right-1/2 mix-blend-multiply filter blur-2xl animate-blob animation-delay-[3000ms]" />
        <div className="absolute bg-indigo-500 opacity-30 rounded-full w-48 h-48 top-3/4 right-10 mix-blend-multiply filter blur-2xl animate-blob animation-delay-[1500ms]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center bg-black/30 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
          <img src={logoPolri} alt="Logo POLRI" className="w-10" />
          <h1 className="text-lg font-semibold tracking-wide">
            KEPOLISIAN RESOR KLUNGKUNG
          </h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <button
            onClick={() => scrollToSection("tentang")}
            className="hover:text-yellow-300 transition"
          >
            Tentang SKCK
          </button>
          <button
            onClick={() => scrollToSection("roles")}
            className="hover:text-yellow-300 transition"
          >
            Masuk Sebagai
          </button>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        <motion.img
          src={logoPolri}
          alt="Logo POLRI"
          className="w-32 md:w-40 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold uppercase tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          SISTEM SKCK TERDESENTRALISASI<br />POLRES KLUNGKUNG
        </motion.h1>
        <motion.p
          className="mt-6 text-lg md:text-xl max-w-2xl text-white/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          Dikelola secara aman, transparan, dan efisien berbasis Blockchain & Interplanetary File System (IPFS).
        </motion.p>
      </div>

      {/* Tentang SKCK */}
      <section
        id="tentang"
        className="relative z-10 bg-white text-gray-900 px-6 md:px-16 py-16 rounded-t-3xl shadow-2xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Apa Itu SKCK?
        </h2>
        <p className="max-w-4xl mx-auto text-justify text-lg leading-relaxed mb-4">
          SKCK (Surat Keterangan Catatan Kepolisian) adalah surat keterangan resmi yang diterbitkan oleh Polri melalui fungsi Intelkam kepada seorang pemohon/warga masyarakat untuk menerangkan tentang ada ataupun tidak adanya catatan suatu individu dalam kegiatan kriminalitas atau kejahatan.
        </p>
        <p className="max-w-4xl mx-auto text-justify text-base text-gray-700 leading-relaxed mb-12">
          Contoh keperluan yang mensyaratkan SKCK sebagai kelengkapannya antara lain: melamar pekerjaan, pendaftaran CPNS, pencalonan kepala daerah, pembuatan visa, dan keperluan administratif lainnya.
        </p>

        {/* Roles */}
        <div
          id="roles"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="bg-blue-100 border border-blue-200 p-6 rounded-2xl shadow-md hover:bg-blue-200 hover:shadow-lg hover:scale-105 transform transition duration-300 text-center cursor-pointer"
              onClick={() => navigate(role.route)}
            >
              <div className="flex justify-center">{role.icon}</div>
              <h3 className="text-xl font-semibold text-blue-900 mt-3">{role.title}</h3>
              <p className="text-blue-800 mt-2 text-sm">{role.description}</p>
              <button
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-full text-sm transition"
                onClick={() => navigate(role.route)}
              >
                Masuk
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
