// hash-generator.jss
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = "harsh123";
  const hash = await bcrypt.hash(password, 10); // 10 salt rounds
  console.log("Password:", password);
  console.log("Hash:", hash);
}

generateHash();


