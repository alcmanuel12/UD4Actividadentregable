require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./database');

const coleccionesRoutes = require('./routes/colecciones');
const relojesRoutes = require('./routes/relojes');
const joyasRoutes = require('./routes/joyas');
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use((req, res, next) => {
    const inicio = Date.now();
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracion}ms)`);
    });
    next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/colecciones', coleccionesRoutes);
app.use('/api/relojes', relojesRoutes);
app.use('/api/joyas', joyasRoutes);

app.get('/health', (req, res) => {
    const estadoDB = mongoose.connection.readyState;
    const dbConectada = estadoDB === 1;
    const estado = {
        status: dbConectada ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        database: dbConectada ? 'conectada' : 'desconectada'
    };
    console.log(`[${estado.timestamp}] HEALTH CHECK -> ${estado.status} | DB: ${estado.database}`);
    res.status(dbConectada ? 200 : 503).json(estado);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Servidor de Joyería corriendo en el puerto ${PORT}`);
});