// lib/chatbot.js
// "Otak" AI di sini murni simulasi buatan sendiri: keyword matching + array
// balasan acak untuk fallback. Tidak ada panggilan ke API AI eksternal
// apa pun (sesuai ketentuan tugas).

const store = require("./store");

const FALLBACK_REPLIES = [
  "Maaf, saya belum paham maksudnya. Bisa coba tanya soal jam buka, ongkir, cara bayar, atau stok produk?",
  "Hmm, pertanyaannya belum saya kenali. Coba tanyakan tentang jam operasional, pengiriman, pembayaran, atau ketersediaan barang ya.",
  "Saya masih versi sederhana, jadi belum bisa jawab semua hal. Coba tanya soal jam buka, ongkir, pembayaran, atau stok produk."
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function findStockAnswer(message) {
  const products = store.getAll();
  const found = products.find((p) =>
    message.includes(p.name.toLowerCase())
  );

  if (found) {
    return found.stock > 0
      ? `Stok "${found.name}" saat ini masih ada ${found.stock} unit, harganya Rp ${found.price.toLocaleString("id-ID")}.`
      : `Mohon maaf, stok "${found.name}" sedang kosong. Coba cek lagi beberapa hari ke depan ya.`;
  }

  return null;
}

function getReply(rawMessage) {
  const message = String(rawMessage || "").toLowerCase().trim();

  if (!message) {
    return "Sepertinya pesannya kosong. Coba tulis pertanyaan Anda ya.";
  }

  // Cek dulu apakah menyebut nama produk spesifik (soal stok/ketersediaan)
  const stockAnswer = findStockAnswer(message);
  if (stockAnswer) return stockAnswer;

  if (/(jam\s*buka|jam\s*operasional|buka\s*jam|tutup\s*jam|jam\s*berapa)/.test(message)) {
    return "Toko buka setiap hari jam 06.00 - 20.00 WIB, termasuk Sabtu-Minggu. Hari besar bisa tutup lebih awal, ya.";
  }

  if (/(ongkir|antar|kirim|delivery|diantar)/.test(message)) {
    return "Kami bisa antar untuk wilayah sekitar toko. Order sebelum jam 12 siang biasanya sampai hari yang sama. Ongkir tergantung jarak, mulai dari Rp 5.000.";
  }

  if (/(bayar|pembayaran|transfer|cod|qris|cash)/.test(message)) {
    return "Pembayaran bisa cash di tempat, transfer bank, atau QRIS. Untuk COD hanya tersedia di wilayah dekat toko.";
  }

  if (/(stok|stock|tersedia|ada\s*gak|ada\s*ga|kosong)/.test(message)) {
    return "Boleh sebutkan nama produknya? Saya bisa cek stok dan harganya langsung untuk Anda.";
  }

  if (/(halo|hai|hi|selamat\s*(pagi|siang|sore|malam))/.test(message)) {
    return "Halo juga! Ada yang bisa saya bantu? Anda bisa tanya soal jam buka, ongkir, cara bayar, atau stok produk.";
  }

  if (/(terima\s*kasih|makasih|thanks)/.test(message)) {
    return "Sama-sama! Kalau ada pertanyaan lain seputar toko, tanya saja ya.";
  }

  return pickRandom(FALLBACK_REPLIES);
}

module.exports = { getReply };
