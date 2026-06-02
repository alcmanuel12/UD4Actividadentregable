const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, password, roles } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username y password son obligatorios' });
        }
        const existe = await User.findOne({ username });
        if (existe) {
            return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
        }
        const user = await User.create({ username, password, roles });
        res.status(201).json({ success: true, message: 'Usuario registrado', data: { username: user.username, roles: user.roles } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username y password son obligatorios' });
        }
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
        const payload = { id: user._id, username: user.username, roles: user.roles };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/refresh', (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token no proporcionado' });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const payload = { id: decoded.id, username: decoded.username, roles: decoded.roles };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.status(200).json({ success: true, accessToken });
    } catch {
        res.status(401).json({ success: false, message: 'Refresh token inválido o expirado' });
    }
});

module.exports = router;
