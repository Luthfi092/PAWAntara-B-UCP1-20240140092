// routes/products.js
const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET /produk - daftar semua produk + filter lewat query string (server-side)
router.get("/produk", (req, res) => {
  const { kategori, search } = req.query;
  let filtered = products;

  if (kategori) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === String(kategori).toLowerCase()
    );
  }

  if (search) {
    const keyword = String(search).toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  // Daftar kategori unik untuk dropdown filter di view
  const categories = [...new Set(products.map((p) => p.category))];

  res.render("produk", {
    title: "Produk - Toko Sembako Bu Aries",
    activePage: "produk",
    products: filtered,
    categories,
    query: { kategori: kategori || "", search: search || "" }
  });
});

// GET /produk/:id - detail 1 produk berdasarkan id dari URL (route dinamis)
router.get("/produk/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!Number.isInteger(id) || !product) {
    return res.status(404).render("produk-detail", {
      title: "Produk Tidak Ditemukan - Toko Sembako Bu Aries",
      activePage: "produk",
      product: null
    });
  }

  res.render("produk-detail", {
    title: `${product.name} - Toko Sembako Bu Aries`,
    activePage: "produk",
    product
  });
});

// GET /api/products - REST API read-only, kembalikan seluruh data produk dalam JSON
router.get("/api/products", (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

module.exports = router;
