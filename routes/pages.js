// routes/pages.js
const express = require("express");
const router = express.Router();
const store = require("../lib/store");

// GET / - Beranda: hero section + preview beberapa produk (dari store yang sama dengan API)
router.get("/", (req, res) => {
  const previewProducts = store.getAll().slice(0, 4);
  res.render("beranda", {
    title: "Toko Sembako Bu Aries",
    activePage: "beranda",
    previewProducts
  });
});

// GET /tanya-ai - chat UI, balasan diambil lewat fetch ke POST /api/chat
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    title: "Tanya AI - Toko Sembako Bu Aries",
    activePage: "tanya-ai"
  });
});

module.exports = router;
