const express = require('express');
const connectDB = require('./database');

const coleccionesRoutes = require('./routes/colecciones');
const relojesRoutes = require('./routes/relojes');
const joyasRoutes = require('./routes/joyas');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/colecciones', coleccionesRoutes);

app.use('/api/relojes', relojesRoutes);

app.use('/api/joyas', joyasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Joyería corriendo en el puerto ${PORT}`);
});