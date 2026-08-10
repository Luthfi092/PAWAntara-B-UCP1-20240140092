// lib/store.js
// Penyimpanan produk in-memory (array of object) yang dipakai bersama oleh
// semua route: GET /api/products, POST/PUT/DELETE /api/products, halaman
// dashboard, dan halaman publik. Karena Node meng-cache module, semua file
// yang require('./store') memakai array yang SAMA — jadi data yang dibaca
// GET selalu sinkron dengan perubahan dari endpoint mutasi.

let products = [
  { id: 1, name: "Beras Premium 5kg", category: "sembako", price: 68000, stock: 42, description: "Beras putih premium pulen, cocok untuk kebutuhan harian keluarga." },
  { id: 2, name: "Minyak Goreng 2L", category: "sembako", price: 34000, stock: 30, description: "Minyak goreng kemasan jerigen 2 liter, jernih dan tahan lama." },
  { id: 3, name: "Gula Pasir 1kg", category: "sembako", price: 16500, stock: 55, description: "Gula pasir putih kristal halus, kemasan 1 kilogram." },
  { id: 4, name: "Telur Ayam 1kg", category: "protein", price: 29000, stock: 20, description: "Telur ayam negeri segar pilihan, isi kurang lebih 16 butir per kg." },
  { id: 5, name: "Tepung Terigu 1kg", category: "sembako", price: 13000, stock: 38, description: "Tepung terigu serbaguna, cocok untuk gorengan maupun kue." },
  { id: 6, name: "Kecap Manis 600ml", category: "bumbu", price: 21000, stock: 25, description: "Kecap manis kental legit, botol isi 600ml." },
  { id: 7, name: "Garam Dapur 500g", category: "bumbu", price: 4500, stock: 60, description: "Garam beryodium halus untuk masakan sehari-hari." },
  { id: 8, name: "Kopi Bubuk 200g", category: "minuman", price: 18500, stock: 33, description: "Kopi bubuk robusta pilihan, aroma kuat, kemasan 200 gram." }
];

let nextId = products.length + 1;

function getAll(filters = {}) {
  let result = products;
  const { kategori, search } = filters;

  if (kategori) {
    result = result.filter(
      (p) => p.category.toLowerCase() === String(kategori).toLowerCase()
    );
  }

  if (search) {
    const keyword = String(search).toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  return result;
}

function getById(id) {
  return products.find((p) => p.id === Number(id)) || null;
}

function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}

function create(data) {
  const newProduct = {
    id: nextId++,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    stock: Number(data.stock),
    description: data.description || ""
  };
  products.push(newProduct);
  return newProduct;
}

function update(id, data) {
  const product = getById(id);
  if (!product) return null;

  if (data.name !== undefined) product.name = data.name;
  if (data.category !== undefined) product.category = data.category;
  if (data.price !== undefined) product.price = Number(data.price);
  if (data.stock !== undefined) product.stock = Number(data.stock);
  if (data.description !== undefined) product.description = data.description;

  return product;
}

function remove(id) {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, getCategories, create, update, remove };
