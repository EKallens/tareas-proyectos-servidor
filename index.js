const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Definir el puerto de la app
const port = process.env.PORT || 4000;

//Habilitar express.json
app.use(express.json({ extended: true }));

//Importar rutas
app.use('/api/usuarios', require('./routes/usuariosRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/proyectos', require('./routes/proyectosRoute'));
app.use('/api/tareas', require('./routes/tareasRoute'));

//Correr la app
app.listen(port, '0.0.0.0', () => {
    
});