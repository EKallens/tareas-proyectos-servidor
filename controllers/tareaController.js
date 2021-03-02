const Tarea = require('./../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    console.log(req.body);
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        const { proyectoId } = req.body;

        const existeProyecto = await Proyecto.findById(proyectoId);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        const tarea = new Tarea(req.body);
        tarea.save();

        res.json({ tarea, msg: 'Tarea creada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear la tarea' });
    }
}

exports.obtenerTareas = async (req, res) => {

    try {
        const { proyectoId } = req.query;
        const existeProyecto = await Proyecto.findById(proyectoId);

        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            const tareas = {};
            return res.status(401).json({tareas, msg: 'No Autorizado' })
        }

        const tareas = await Tarea.find({ proyectoId }).sort({ creado: -1 });
        res.json({ tareas })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener las tareas' });
    }

}

exports.actualizarTarea = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {

        const { proyectoId, nombre, estado } = req.body;
        let tarea = await Tarea.findById(req.params.id);
        const existeProyecto = await Proyecto.findById(proyectoId);

        if (!tarea) {
            return res.status(400).json({ msg: 'No existe la tarea' })
        }

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        //Creamos un objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar la tarea' })
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        const { proyectoId } = req.query;
        const tarea = Tarea.findById(req.params.id);
        const existeProyecto = await Proyecto.findById(proyectoId);

        if (!tarea) {
            return res.status(404).json({ msg: 'No existe la tarea' })
        }

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.status(200).json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar una tarea' });
    }
}