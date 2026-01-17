// hash-generator.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = "yogesh@10";
  const hash = await bcrypt.hash(password, 10); // 10 salt rounds
  console.log("Password:", password);
  console.log("Hash:", hash);
}

generateHash();