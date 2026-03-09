const mongoose = require('mongoose');

const joyaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: [true, 'El tipo de joya es obligatorio (Anillo, Collar, etc.)']
    },
    material: {
        type: String,
        enum: {
        values: ['Oro', 'Plata', 'Oro Blanco', 'Platino'],
        message: 'El material debe ser Oro o Plata'
        },
        required: true
    },
    fechaCertificacion: {
        type: Date,
        required: [true, 'La fecha de certificación es obligatoria']
    },
    coleccion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coleccion'
    }
});

module.exports = mongoose.model('Joya', joyaSchema);