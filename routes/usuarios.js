//TURNOSTRABAJADORES/routes/usuarios.js

const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../services/authService');
const authMiddleware = require('../middleware/auth');
const Usuario = require('../models/User');

// Endpoint para registrar un usuario (solo administradores)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    const resultado = await registrarUsuario(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(400).json({ mensaje: error.message });
  }
});

// Endpoint para obtener la lista de usuarios con paginación
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    const usuarios = await Usuario.find({}, 'nombre email rol')
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Usuario.countDocuments();

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      usuarios,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Endpoint para eliminar usuario (solo admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

module.exports = router;
