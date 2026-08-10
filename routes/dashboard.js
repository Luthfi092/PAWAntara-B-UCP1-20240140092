// routes/dashboard.js
const express = require("express");
const router = express.Router();
const store = require("../lib/store");
const { requireLoginPage } = require("../lib/auth");

// GET /dashboard - WAJIB LOGIN (halaman, bukan API -> redirect ke /login kalau belum)
router.get("/dashboard", requireLoginPage, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard Admin - Toko Sembako Bu Aries",
    activePage: "dashboard",
    initialProducts: store.getAll(),
    categories: store.getCategories()
  });
});

module.exports = router;
