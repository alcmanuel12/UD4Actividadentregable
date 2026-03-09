const mongoose = require('mongoose');

const relojSchema = new mongoose.Schema({
    modelo: {
        type: String,
        required: [true, 'El modelo del reloj es obligatorio'],
        maxlength: [50, 'El nombre del modelo no puede exceder 50 caracteres']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    tipoMovimiento: {
        type: String,
        enum: {
        values: ['Cuarzo', 'Automático', 'Mecánico', 'Solar'],
        message: 'El tipo de movimiento {VALUE} no es válido'
        }
    },
    resistenciaAgua: {
        type: Number,
        default: 30
    },
    esEdicionLimitada: {
        type: Boolean,
        default: false
    },
    coleccion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coleccion',
        required: [true, 'El reloj debe pertenecer a una colección']
    }
});

module.exports = mongoose.model('Reloj', relojSchema);