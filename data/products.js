// data/products.js
// Data produk dummy (array of object) - fondasi sebelum pakai database sungguhan di Sprint 2

const products = [
  {
    id: 1,
    name: "Beras Premium 5kg",
    category: "sembako",
    price: 68000,
    stock: 42,
    image: "/img/beras.svg",
    description: "Beras putih premium pulen, cocok untuk kebutuhan harian keluarga."
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    category: "sembako",
    price: 34000,
    stock: 30,
    image: "/img/minyak.svg",
    description: "Minyak goreng kemasan jerigen 2 liter, jernih dan tahan lama."
  },
  {
    id: 3,
    name: "Gula Pasir 1kg",
    category: "sembako",
    price: 16500,
    stock: 55,
    image: "/img/gula.svg",
    description: "Gula pasir putih kristal halus, kemasan 1 kilogram."
  },
  {
    id: 4,
    name: "Telur Ayam 1kg",
    category: "protein",
    price: 29000,
    stock: 20,
    image: "/img/telur.svg",
    description: "Telur ayam negeri segar pilihan, isi kurang lebih 16 butir per kg."
  },
  {
    id: 5,
    name: "Tepung Terigu 1kg",
    category: "sembako",
    price: 13000,
    stock: 38,
    image: "/img/tepung.svg",
    description: "Tepung terigu serbaguna, cocok untuk gorengan maupun kue."
  },
  {
    id: 6,
    name: "Kecap Manis 600ml",
    category: "bumbu",
    price: 21000,
    stock: 25,
    image: "/img/kecap.svg",
    description: "Kecap manis kental legit, botol isi 600ml."
  },
  {
    id: 7,
    name: "Garam Dapur 500g",
    category: "bumbu",
    price: 4500,
    stock: 60,
    image: "/img/garam.svg",
    description: "Garam beryodium halus untuk masakan sehari-hari."
  },
  {
    id: 8,
    name: "Kopi Bubuk 200g",
    category: "minuman",
    price: 18500,
    stock: 33,
    image: "/img/kopi.svg",
    description: "Kopi bubuk robusta pilihan, aroma kuat, kemasan 200 gram."
  }
];

module.exports = products;
