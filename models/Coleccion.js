const mongoose = require('mongoose');

const coleccionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la colección es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        trim: true
    },
    temporada: {
        type: String,
        enum: {
        values: ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Atemporal'],
        message: '{VALUE} no es una temporada válida'
        },
        default: 'Atemporal'
    },
    fechaLanzamiento: {
        type: Date,
        default: Date.now
    },
    activa: {
        type: Boolean,
        default: true
    }
    });

module.exports = mongoose.model('Coleccion', coleccionSchema);