// routes/pages.js
const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET / - Beranda: hero section + preview beberapa produk
router.get("/", (req, res) => {
  const previewProducts = products.slice(0, 4);
  res.render("beranda", {
    title: "Toko Sembako Bu Aries",
    activePage: "beranda",
    previewProducts
  });
});

// GET /tanya-ai - tampilan chat + form, belum ada logic balasan
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    title: "Tanya AI - Toko Sembako Bu Aries",
    activePage: "tanya-ai"
  });
});

module.exports = router;
