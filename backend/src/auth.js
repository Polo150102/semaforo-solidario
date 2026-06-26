const crypto = require("crypto");

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password, salt, expectedHash) {
  const calculatedHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHash, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

function createDemoToken(user) {
  const payload = {
    id: user.id,
    usuario: user.usuario,
    rol: user.rol,
    issuedAt: Date.now()
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

module.exports = {
  verifyPassword,
  createDemoToken
};
