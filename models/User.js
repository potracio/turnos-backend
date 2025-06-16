//TURNOSTRABAJADORES/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'trabajador'],
    default: 'trabajador'
  }
});

module.exports = mongoose.model('User', userSchema);
