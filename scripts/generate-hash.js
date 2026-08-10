// scripts/generate-hash.js
// Pemakaian: node scripts/generate-hash.js "password_baru"
// Hasilnya di-copy ke ADMIN_PASSWORD_HASH di file .env

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Pemakaian: node scripts/generate-hash.js \"password_kamu\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
