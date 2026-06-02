const express = require('express');
const router = express.Router();
const Coleccion = require('../models/Coleccion');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const nuevaColeccion = await Coleccion.create(req.body);
        res.status(201).json({ success: true, data: nuevaColeccion });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const colecciones = await Coleccion.find();
        res.status(200).json({ success: true, count: colecciones.length, data: colecciones });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const coleccion = await Coleccion.findById(req.params.id);
        if (!coleccion) {
            return res.status(404).json({ success: false, message: 'Colección no encontrada' });
        }
        res.status(200).json({ success: true, data: coleccion });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const coleccion = await Coleccion.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!coleccion) {
            return res.status(404).json({ success: false, message: 'Colección no encontrada' });
        }
        res.status(200).json({ success: true, data: coleccion });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const coleccion = await Coleccion.findByIdAndDelete(req.params.id);
        if (!coleccion) {
            return res.status(404).json({ success: false, message: 'Colección no encontrada' });
        }
        res.status(200).json({ success: true, message: 'Colección eliminada con éxito' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
