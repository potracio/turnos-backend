//TURNOSTRABAJADORES/models/Turno.js

const mongoose = require('mongoose');

const turnosShema = new mongoose.Schema({
    trabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fecha: {
        type: Date,
        required: true

    },
    turno: {
        type: String,
        enum: ['mañana', 'tarde', 'libre'],
        required: true
    }
});

// O incluso combinado si consultas por ambos:
turnosShema.index({ trabajador: 1, fecha: 1 });

module.exports = mongoose.model('Turno', turnosShema);
