// routes/products.js
const express = require("express");
const router = express.Router();
const store = require("../lib/store");
const { requireLoginApi } = require("../lib/auth");

// ===================== HALAMAN PUBLIK (SSR) =====================

// GET /produk - shell halaman, data produk diambil lewat fetch ke /api/products (client-side)
router.get("/produk", (req, res) => {
  res.render("produk", {
    title: "Produk - Toko Sembako Bu Aries",
    activePage: "produk"
  });
});

// GET /produk/:id - detail 1 produk, SSR langsung dari store yang sama dengan API
router.get("/produk/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = !Number.isNaN(id) ? store.getById(id) : null;

  if (!product) {
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

// ===================== REST API PRODUK =====================

// GET /api/products - PUBLIK, tidak perlu login. Mendukung ?kategori= & ?search=
router.get("/api/products", (req, res) => {
  const { kategori, search } = req.query;
  const data = store.getAll({ kategori, search });

  res.json({
    success: true,
    count: data.length,
    categories: store.getCategories(),
    data
  });
});

// GET /api/products/:id - PUBLIK
router.get("/api/products/:id", (req, res) => {
  const product = store.getById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
  }

  res.json({ success: true, data: product });
});

// Validasi input dasar di server (jangan hanya percaya validasi frontend)
function validateProductInput(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (!body.name || String(body.name).trim() === "") errors.push("Nama produk wajib diisi.");
  }
  if (!partial || body.category !== undefined) {
    if (!body.category || String(body.category).trim() === "") errors.push("Kategori wajib diisi.");
  }
  if (!partial || body.price !== undefined) {
    if (body.price === undefined || body.price === "" || Number.isNaN(Number(body.price)) || Number(body.price) < 0) {
      errors.push("Harga wajib diisi dengan angka valid (>= 0).");
    }
  }
  if (!partial || body.stock !== undefined) {
    if (body.stock === undefined || body.stock === "" || Number.isNaN(Number(body.stock)) || Number(body.stock) < 0) {
      errors.push("Stok wajib diisi dengan angka valid (>= 0).");
    }
  }

  return errors;
}

// POST /api/products - WAJIB LOGIN
router.post("/api/products", requireLoginApi, (req, res) => {
  const errors = validateProductInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  const newProduct = store.create(req.body);
  res.status(201).json({
    success: true,
    message: "Produk berhasil ditambahkan.",
    data: newProduct
  });
});

// PUT /api/products/:id - WAJIB LOGIN
router.put("/api/products/:id", requireLoginApi, (req, res) => {
  const existing = store.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
  }

  const errors = validateProductInput(req.body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  const updated = store.update(req.params.id, req.body);
  res.json({
    success: true,
    message: "Produk berhasil diperbarui.",
    data: updated
  });
});

// DELETE /api/products/:id - WAJIB LOGIN
router.delete("/api/products/:id", requireLoginApi, (req, res) => {
  const deleted = store.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
  }

  res.json({ success: true, message: "Produk berhasil dihapus." });
});

module.exports = router;
