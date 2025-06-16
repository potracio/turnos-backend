//TURNOSTRABAJADORES/services/authService.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET || 'claveSecretaPorDefecto',
    { expiresIn: '1h' }
  );
};

async function registrarUsuario({ nombre, email, password, rol = 'trabajador' }) {
  if (!nombre || !email || !password) {
    throw new Error('Todos los campos son obligatorios');
  }

  const existe = await User.findOne({ email });
  if (existe) throw new Error('El correo ya está registrado');

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ nombre, email, password: hashed, rol });
  await user.save();

  return { mensaje: 'Usuario registrado correctamente' };
}

async function loginUsuario({ email, password }) {
  if (!email || !password) throw new Error('Email y contraseña obligatorios');

  const user = await User.findOne({ email });
  if (!user) throw new Error('Credenciales inválidas');

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) throw new Error('Credenciales inválidas');

  const token = generarToken(user);
  return {
    token,
    usuario: {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  };
}

module.exports = { registrarUsuario, loginUsuario };
