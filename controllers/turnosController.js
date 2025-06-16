//TURNOSTRABAJADORES/controllers/turnosController.js

const Turno = require('../models/Turno');

// Listado provisional de turnos (puedes adaptarlo según tu lógica)
exports.listadoProvisional = async (req, res) => {
  try {
    const turnos = await Turno.find()
      .populate('trabajador', 'nombre email rol')
      .sort({ fecha: 1 });
    res.json(turnos);
  } catch (error) {
    console.error('Error en listadoProvisional:', error);
    res.status(500).json({ mensaje: 'Error al obtener turnos' });
  }
};

// Asignar turnos (adaptar según tu lógica de asignación)
exports.asignarTurnos = async (req, res) => {
  try {
    // Ejemplo básico: recibe array de turnos para insertar
    const { turnos } = req.body;
    if (!Array.isArray(turnos)) {
      return res.status(400).json({ mensaje: 'Debe enviar un arreglo de turnos' });
    }

    // Aquí podrías validar cada turno y verificar conflictos
    await Turno.insertMany(turnos);

    res.status(201).json({ mensaje: 'Turnos asignados correctamente' });
  } catch (error) {
    console.error('Error en asignarTurnos:', error);
    res.status(500).json({ mensaje: 'Error al asignar turnos' });
  }
};

// Vista HTML de turnos (puedes adaptar la vista o usar template engine)
exports.vistaTurnosHTML = async (req, res) => {
  try {
    const turnos = await Turno.find()
      .populate('trabajador', 'nombre')
      .sort({ fecha: 1 });

    let html = `<h1>Listado de Turnos</h1><ul>`;
    turnos.forEach(t => {
      html += `<li>${t.trabajador.nombre} - ${t.fecha.toISOString().slice(0, 10)} - ${t.turno}</li>`;
    });
    html += `</ul>`;

    res.send(html);
  } catch (error) {
    console.error('Error en vistaTurnosHTML:', error);
    res.status(500).send('Error al cargar la vista de turnos');
  }
};

// Obtener los turnos del usuario autenticado
exports.misTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find({ trabajador: req.user._id }).sort({ fecha: 1 });
    res.json(turnos);
  } catch (error) {
    console.error('Error en misTurnos:', error);
    res.status(500).json({ mensaje: 'Error al obtener tus turnos' });
  }
};

// Actualizar un turno por ID (solo admin)
exports.actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const turno = await Turno.findByIdAndUpdate(id, datos, { new: true });
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }

    res.json({ mensaje: 'Turno actualizado', turno });
  } catch (error) {
    console.error('Error en actualizarTurno:', error);
    res.status(500).json({ mensaje: 'Error al actualizar turno' });
  }
};

// Eliminar un turno por ID (solo admin)
exports.eliminarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByIdAndDelete(req.params.id);
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    return res.json({ mensaje: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar turno' });
  }
};

// Obtener turnos paginados con filtro opcional
exports.obtenerTurnosPaginados = async (filtro, skip, limit) => {
  return await Turno.find(filtro)
    .populate('trabajador', 'nombre email rol')
    .skip(skip)
    .limit(limit)
    .sort({ fecha: 1 });
};

// Contar turnos con filtro
exports.contarTurnos = async (filtro) => {
  return await Turno.countDocuments(filtro);
};
