//TURNOSTRABAJADORES/routes/turnos.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/role");
const turnosController = require("../controllers/turnosController");

router.get("/", auth, turnosController.listadoProvisional);
router.post("/asignar", auth, authorize("admin"), turnosController.asignarTurnos);
router.get("/vista", auth, authorize("admin"), turnosController.vistaTurnosHTML);
router.get("/mis-turnos", auth, turnosController.misTurnos);
router.put('/:id', auth, authorize("admin"), turnosController.actualizarTurno);

// Nueva ruta DELETE para eliminar turno (solo admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await turnosController.eliminarTurno(req, res);
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    res.status(500).json({ mensaje: 'Error al eliminar turno' });
  }
});

// Ruta con paginación para obtener turnos JSON (solo admin)
router.get('/json', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, trabajador } = req.query;
    const skip = (page - 1) * limit;

    const filtro = trabajador ? { trabajador } : {};

    const turnos = await turnosController.obtenerTurnosPaginados(filtro, skip, parseInt(limit));
    const total = await turnosController.contarTurnos(filtro);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      turnos,
    });
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ mensaje: 'Error al obtener turnos' });
  }
});

module.exports = router;
