// lib/auth.js
const bcrypt = require("bcryptjs");

// Kredensial admin diambil dari .env — password TIDAK disimpan plain text,
// yang disimpan adalah hash bcrypt-nya (ADMIN_PASSWORD_HASH).
function verifyCredentials(username, password) {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!validUsername || !validPasswordHash) return false;
  if (username !== validUsername) return false;

  return bcrypt.compareSync(password, validPasswordHash);
}

// Melindungi HALAMAN (mis. /dashboard) — kalau belum login, redirect ke /login
function requireLoginPage(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.redirect("/login");
}

// Melindungi ENDPOINT API (POST/PUT/DELETE produk) — kalau belum login,
// balas 401 JSON. Ini yang menjamin proteksi tetap berlaku walau di-hit
// langsung lewat Postman tanpa lewat UI.
function requireLoginApi(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Unauthorized — silakan login terlebih dahulu."
  });
}

module.exports = { verifyCredentials, requireLoginPage, requireLoginApi };
