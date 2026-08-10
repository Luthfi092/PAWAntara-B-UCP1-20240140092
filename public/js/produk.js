// public/js/produk.js
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("productGrid");
  const filterForm = document.getElementById("filterForm");
  const searchInput = document.getElementById("search");
  const kategoriSelect = document.getElementById("kategori");
  const resetBtn = document.getElementById("resetFilterBtn");

  let icons = {};
  try {
    icons = JSON.parse(document.getElementById("icons-data").textContent);
  } catch (e) {
    icons = {};
  }

  function getIconSvg(category) {
    return icons[category] || icons.sembako || "";
  }

  function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderProducts(products) {
    if (products.length === 0) {
      grid.innerHTML = "";
      grid.insertAdjacentHTML(
        "afterend",
        `<div class="empty-state" id="emptyState">
          <p>Produk tidak ditemukan untuk filter yang dipilih.</p>
          <button type="button" class="btn btn-sm" id="emptyResetBtn">Reset Filter</button>
        </div>`
      );
      document.getElementById("emptyResetBtn").addEventListener("click", resetFilter);
      return;
    }

    const existingEmpty = document.getElementById("emptyState");
    if (existingEmpty) existingEmpty.remove();

    grid.innerHTML = products
      .map(
        (p) => `
      <article class="product-card">
        <div class="product-thumb">${getIconSvg(p.category)}</div>
        <div class="product-body">
          <p class="product-category">${escapeHtml(p.category)}</p>
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-price">${formatRupiah(p.price)}</p>
          <p class="product-stock">Stok: ${p.stock}</p>
          <a href="/produk/${p.id}" class="btn btn-sm">Lihat Detail</a>
        </div>
      </article>
    `
      )
      .join("");
  }

  function populateCategoryOptions(categories, selected) {
    const current = kategoriSelect.value;
    kategoriSelect.innerHTML =
      `<option value="">Semua kategori</option>` +
      categories
        .map(
          (cat) =>
            `<option value="${cat}" ${cat === (selected || current) ? "selected" : ""}>${
              cat.charAt(0).toUpperCase() + cat.slice(1)
            }</option>`
        )
        .join("");
  }

  async function loadProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.kategori) query.set("kategori", params.kategori);
    if (params.search) query.set("search", params.search);

    try {
      const res = await fetch(`/api/products?${query.toString()}`);
      const result = await res.json();
      renderProducts(result.data || []);
      if (result.categories) {
        populateCategoryOptions(result.categories, params.kategori);
      }
    } catch (err) {
      console.error("Gagal memuat produk:", err);
      grid.innerHTML = `<div class="empty-state">Gagal memuat data produk. Coba refresh halaman.</div>`;
    }
  }

  function getParamsFromUrl() {
    const url = new URL(window.location.href);
    return {
      kategori: url.searchParams.get("kategori") || "",
      search: url.searchParams.get("search") || ""
    };
  }

  function applyFilterFromForm(pushState) {
    const params = {
      kategori: kategoriSelect.value,
      search: searchInput.value.trim()
    };

    if (pushState) {
      const url = new URL(window.location.href);
      url.search = "";
      if (params.kategori) url.searchParams.set("kategori", params.kategori);
      if (params.search) url.searchParams.set("search", params.search);
      window.history.pushState({}, "", url);
    }

    loadProducts(params);
  }

  function resetFilter() {
    searchInput.value = "";
    kategoriSelect.value = "";
    const url = new URL(window.location.href);
    url.search = "";
    window.history.pushState({}, "", url);
    loadProducts({});
  }

  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    applyFilterFromForm(true);
  });

  resetBtn.addEventListener("click", resetFilter);

  // Inisialisasi dari query string URL (kalau ada) supaya link/bookmark filter tetap jalan
  const initialParams = getParamsFromUrl();
  searchInput.value = initialParams.search;
  loadProducts(initialParams);
});
