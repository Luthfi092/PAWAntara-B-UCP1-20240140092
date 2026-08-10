// routes/auth.js
const express = require("express");
const router = express.Router();
const { verifyCredentials } = require("../lib/auth");

// GET /login - halaman form login (kalau sudah login, langsung ke dashboard)
router.get("/login", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login Admin - Toko Sembako Bu Aries",
    activePage: "login"
  });
});

// POST /api/login - cek kredensial, simpan sesi kalau valid
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password wajib diisi."
    });
  }

  const isValid = verifyCredentials(username, password);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: "Username atau password salah."
    });
  }

  req.session.isAdmin = true;
  req.session.username = username;

  res.json({
    success: true,
    message: "Login berhasil.",
    data: { username },
    redirect: "/dashboard"
  });
});

// POST /api/logout - hapus sesi
router.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal logout." });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logout berhasil.", redirect: "/login" });
  });
});

module.exports = router;
