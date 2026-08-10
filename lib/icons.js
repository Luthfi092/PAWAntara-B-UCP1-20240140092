// lib/icons.js
// Set ikon custom (bukan emoji) untuk tiap kategori produk.
// Gaya: monoline outline warna biru (currentColor / var(--color-primary))
// dengan satu aksen bentuk terisi warna pink (var(--color-accent)).
// Semua di viewBox 0 0 48 48 supaya konsisten ukurannya di kartu produk.

function wrap(inner) {
  return `<svg class="product-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

const ICONS = {
  // Beras — karung terikat
  sembako: wrap(`
    <path d="M14 10h20l3 8v18a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V18l3-8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M17 10c0-3 2.5-5 7-5s7 2 7 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="16" y="24" width="16" height="3.5" rx="1.5" class="icon-accent"/>
    <path d="M18 32h12M18 36.5h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
  `),

  // Minyak goreng — botol jerigen
  minyak: wrap(`
    <path d="M20 8h8v5.5l3 3.5v19a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2v-19l3-3.5V8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M18 15.5h12" stroke="currentColor" stroke-width="2"/>
    <rect x="17.5" y="24" width="13" height="10" rx="1.5" class="icon-accent"/>
    <path d="M22 8h4V5.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1V8Z" stroke="currentColor" stroke-width="1.6"/>
  `),

  // Bumbu (kecap/garam) — botol kecil + tetes
  bumbu: wrap(`
    <path d="M21 6h6v6.5l2.5 3V38a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V15.5L21 12.5V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M19.5 12.5h9" stroke="currentColor" stroke-width="2"/>
    <path d="M24 21c1.8 2.1 2.8 3.6 2.8 5a2.8 2.8 0 1 1-5.6 0c0-1.4 1-2.9 2.8-5Z" class="icon-accent"/>
  `),

  // Protein (telur) — dua telur di mangkuk kecil
  protein: wrap(`
    <ellipse cx="18.5" cy="24" rx="6" ry="7.5" stroke="currentColor" stroke-width="2"/>
    <ellipse cx="29" cy="27.5" rx="6" ry="7.5" class="icon-accent-outline" stroke-width="2"/>
    <path d="M10 36c2 3 5 4.5 8.5 4.5S23.5 39 25.5 36" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
  `),

  // Minuman (kopi) — cangkir dengan uap
  minuman: wrap(`
    <path d="M12 20h19v9a9.5 9.5 0 0 1-19 0v-9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M31 22h3a4 4 0 0 1 0 8h-3" stroke="currentColor" stroke-width="2"/>
    <path d="M17 8c-2 2-2 3.5 0 5.5M23 8c-2 2-2 3.5 0 5.5M29 8c-2 2-2 3.5 0 5.5" class="icon-accent-outline" stroke-width="2" stroke-linecap="round"/>
    <rect x="9" y="38" width="25" height="3" rx="1.5" class="icon-accent"/>
  `)
};

function getIcon(category) {
  return ICONS[category] || ICONS.sembako;
}

module.exports = { getIcon, ICONS };
