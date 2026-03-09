const express = require('express');
const router = express.Router();
const Reloj = require('../models/Reloj');


router.post('/', async (req, res) => {
  try {

    const nuevoReloj = await Reloj.create(req.body);
    res.status(201).json({ success: true, data: nuevoReloj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {

    const relojes = await Reloj.find().populate('coleccion', 'nombre temporada');
    res.status(200).json({ success: true, count: relojes.length, data: relojes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const reloj = await Reloj.findById(req.params.id).populate('coleccion');
    if (!reloj) {
      return res.status(404).json({ success: false, message: 'Reloj no encontrado' });
    }
    res.status(200).json({ success: true, data: reloj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const reloj = await Reloj.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('coleccion');

    
    if (!reloj) {
      return res.status(404).json({ success: false, message: 'Reloj no encontrado' });
    }
    res.status(200).json({ success: true, data: reloj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const reloj = await Reloj.findByIdAndDelete(req.params.id);
    if (!reloj) {
      return res.status(404).json({ success: false, message: 'Reloj no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Reloj eliminado' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;