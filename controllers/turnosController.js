// TURNOSTRABAJADORES/controllers/turnosController.js

const Turno = require('../models/Turno');
const User = require('../models/User');

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

exports.asignarTurnos = async (req, res) => {
  try {
    const { turnos } = req.body;
    if (!Array.isArray(turnos)) {
      return res.status(400).json({ mensaje: 'Debe enviar un arreglo de turnos' });
    }
    await Turno.insertMany(turnos);
    res.status(201).json({ mensaje: 'Turnos asignados correctamente' });
  } catch (error) {
    console.error('Error en asignarTurnos:', error);
    res.status(500).json({ mensaje: 'Error al asignar turnos' });
  }
};

exports.generarYAsignarTurnos = async (req, res) => {
  try {
    const { year, month } = req.body;

    if (!year || !month) {
      return res.status(400).json({ mensaje: 'Debes enviar año y mes' });
    }

    const trabajadores = await User.find({ rol: 'trabajador' });
    if (trabajadores.length === 0) {
      return res.status(404).json({ mensaje: 'No hay trabajadores registrados' });
    }

    const turnos = [];
    const diasEnMes = new Date(year, month, 0).getDate();
    const turnosDisponibles = ['mañana', 'tarde'];

    const esFinDeSemana = (fecha) => {
      const dia = fecha.getDay();
      return dia === 0 || dia === 6;
    };

    for (let trabajador of trabajadores) {
      let diasLibres = 0;
      let finesDeSemanaLibres = 0;

      for (let d = 1; d <= diasEnMes; d++) {
        const fecha = new Date(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00.000Z`);

        if ((esFinDeSemana(fecha) && finesDeSemanaLibres < 3) || (!esFinDeSemana(fecha) && diasLibres < 8)) {
          const descansar = Math.random() < 0.25;
          if (descansar) {
            turnos.push({ trabajador: trabajador._id, fecha, turno: 'libre' });
            if (esFinDeSemana(fecha)) finesDeSemanaLibres++;
            else diasLibres++;
            continue;
          }
        }

        const turno = turnosDisponibles[Math.floor(Math.random() * turnosDisponibles.length)];
        turnos.push({ trabajador: trabajador._id, fecha, turno });
      }
    }

    await Turno.insertMany(turnos);
    res.status(201).json({ mensaje: '✅ Turnos generados correctamente', totalTurnos: turnos.length });
  } catch (error) {
    console.error('❌ Error en generarYAsignarTurnos:', error);
    res.status(500).json({ mensaje: 'Error al generar turnos automáticamente' });
  }
};

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

exports.misTurnos = async (req, res) => {
  try {
    const { year, month } = req.query;
    const trabajadorId = req.user?._id;

    console.log("📌 Usuario autenticado en misTurnos:", req.user?.email);

    if (!trabajadorId) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    if (!year || !month) {
      return res.status(400).json({ mensaje: "Debes proporcionar año y mes para el filtrado" });
    }

    const formattedMonth = String(month).padStart(2, '0');

    const turnos = await Turno.find({
      trabajador: trabajadorId,
      fecha: {
        $gte: new Date(`${year}-${formattedMonth}-01T00:00:00.000Z`),
        $lte: new Date(`${year}-${formattedMonth}-31T23:59:59.999Z`)
      }
    }).populate("trabajador", "nombre email rol");

    console.log("📌 Turnos encontrados:", turnos.length);
    res.json(turnos);
  } catch (error) {
    console.error("❌ Error en misTurnos:", error);
    res.status(500).json({ mensaje: "Error al obtener tus turnos" });
  }
};

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

exports.obtenerTurnosPaginados = async (filtro, skip, limit) => {
  return await Turno.find(filtro)
    .populate('trabajador', 'nombre email rol')
    .skip(skip)
    .limit(limit)
    .sort({ fecha: 1 });
};

exports.contarTurnos = async (filtro) => {
  return await Turno.countDocuments(filtro);
};
