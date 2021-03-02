const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Crear proyecto - /api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'Debes ingresar un nombre para el proyecto').not().isEmpty()
    ], 
    proyectoController.crearProyecto
);

//Traer proyectos del usuario - /api/proyectos
router.get('/', auth, proyectoController.obtenerProyectos);

//Actualizar proyecto - /api/proyectos
router.put('/:id',
    auth,
    [
        check('nombre', 'Debes ingresar un nombre para el proyecto').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminar proyecto - /api/proyectos
router.delete('/:id', auth, proyectoController.eliminarProyecto);

module.exports = router;