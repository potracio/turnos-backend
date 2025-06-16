//TURNOSTRABAJADORES/middleware/role.js

const authorize = (requiredRole) => {
  return (req, res, next) => {
    console.log("🔐 Middleware de autorización...");
    console.log("🧑 Rol del usuario:", req.user?.rol);
    console.log("🛡️ Rol requerido:", requiredRole);

    if (!req.user || req.user.rol !== requiredRole) {
      console.warn("❌ Acceso denegado: rol no autorizado");
      return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
    }

    console.log("✅ Acceso autorizado");
    next();
  };
};

module.exports = authorize;
