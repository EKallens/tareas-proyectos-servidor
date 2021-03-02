const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = (req, res) => {

    console.log(req.body);

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        const proyecto = new Proyecto(req.body);
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json({ proyecto, msg: 'Proyecto creado correctamente' });
    } catch (error) {
        return res.status(500).json({ msg: 'Hubo un error' });
    }

}

exports.obtenerProyectos = async (req, res) => {
    
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 })
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mgs: 'Hubo un error al obtener los proyectos' })
    }
}

exports.actualizarProyecto = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar si existe el proyecto con el ID enviado en los parámetros
        let proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({ msg: 'No existe el proyecto' });
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No tienes permisos' });
        }

        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true })
        res.json({ proyecto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar el proyecto' })
    }
}

exports.eliminarProyecto = async (req, res) => {
    let proyecto = await Proyecto.findById(req.params.id);
    console.log(proyecto);

    try {
        if (!proyecto) {
            return res.status(404).json({ msg: 'No existe el proyecto' });
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No tienes permisos' });
        }

        proyecto = await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.status(200).json({ msg: 'Proyecto Eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar el proyecto' });
    }

}