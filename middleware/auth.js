// TURNOSTRABAJADORES/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ mensaje: "Token no proporcionado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    console.log("🧩 Usuario autenticado:", user.email); // log para depuración
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Token inválido:", err);
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};
