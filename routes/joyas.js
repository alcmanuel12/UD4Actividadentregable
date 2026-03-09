const express = require('express');
const router = express.Router();
const Joya = require('../models/Joya');


router.post('/', async (req, res) => {
  try {
    const nuevaJoya = await Joya.create(req.body);
    res.status(201).json({ success: true, data: nuevaJoya });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const joyas = await Joya.find().populate('coleccion', 'nombre');
    res.status(200).json({ success: true, count: joyas.length, data: joyas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const joya = await Joya.findById(req.params.id).populate('coleccion');
    if (!joya) {
      return res.status(404).json({ success: false, message: 'Joya no encontrada' });
    }
    res.status(200).json({ success: true, data: joya });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const joya = await Joya.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('coleccion');

    if (!joya) {
      return res.status(404).json({ success: false, message: 'Joya no encontrada' });
    }
    res.status(200).json({ success: true, data: joya });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const joya = await Joya.findByIdAndDelete(req.params.id);
    if (!joya) {
      return res.status(404).json({ success: false, message: 'Joya no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Joya eliminada' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;