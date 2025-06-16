//TURNOSTRABAJADORES/controllers/authController.js

const { registrarUsuario, loginUsuario } = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const resultado = await registrarUsuario(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const resultado = await loginUsuario(req.body);
    res.json({ mensaje: 'Inicio de sesión exitoso', ...resultado });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(400).json({ mensaje: error.message });
  }
};
