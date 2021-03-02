const express = require('express');
const router = express.Router();
const tareaController = require('./../controllers/tareaController');
const auth = require('./../middlewares/auth');
const { check } = require('express-validator');

//Crear una tarea - /api/tarea
router.post('/', auth, [
    check('nombre', 'Debes ingresar un nombre para la tarea').not().isEmpty()
],
    tareaController.crearTarea
);

//Obtiene las tareas de un proyecto - /api/tarea
router.get('/', auth, tareaController.obtenerTareas);

router.put('/:id', auth, [
    check('nombre', 'Debes ingresar un nombre para la tarea').not().isEmpty()
], 
    tareaController.actualizarTarea);

router.delete('/:id', auth, tareaController.eliminarTarea);

module.exports = router;