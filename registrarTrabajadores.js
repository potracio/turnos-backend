//TURNOSTRABAJADORES/registrarTrabajadores.js


const axios = require('axios');

const usuarios = [];

// 15 mujeres
for (let i = 1; i <= 15; i++) {
  usuarios.push({
    nombre: `Trabajadora ${i}`,
    email: `trabajadora${i}@super.com`,
    password: '123456',
    rol: 'trabajador'
  });
}

// 5 hombres
for (let i = 1; i <= 5; i++) {
  usuarios.push({
    nombre: `Trabajador ${i}`,
    email: `trabajador${i}@super.com`,
    password: '123456',
    rol: 'trabajador'
  });
}

// 2 administradores
usuarios.push({
  nombre: 'Administrador 1',
  email: 'administrador1@super.com',
  password: 'admin123',
  rol: 'admin'
});
usuarios.push({
  nombre: 'Administrador 2',
  email: 'administrador2@super.com',
  password: 'admin123',
  rol: 'admin'
});

async function registrar() {
  for (const usuario of usuarios) {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/registro', usuario);
      console.log(`✅ Registrado: ${usuario.email}`);
    } catch (err) {
      console.error(`❌ Error con ${usuario.email}: ${err.response?.data?.mensaje || err.message}`);
    }
  }
}

registrar();
