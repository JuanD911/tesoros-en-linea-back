const mongoose = require('mongoose');

// Se define el esquema del modelo 'Subasta (Auction)' para enviar al cluster de: MongoDB Atlas.
const auctionSchema = new mongoose.Schema({
    nombre_producto: {
        type: String,
        required: true
    },
    foto_producto: {
        type: String,
        required: true
    },
    descripcion_producto: {
        type: String,
        required: true
    },
    precio_inicial: {
        type: Number,
        required: true
    },
    monto_puja: {
        type: Number,
        required: true
    },
    tipo_subasta: {
        type: String,
        enum: ['privada', 'pública'],
        default: 'pública'
    },
    contraseña_subasta: {
        type: String,
        required: function() {
            return this.tipo_subasta === 'privada';
        }
    }
});
const Auction = mongoose.model('auction', auctionSchema);
module.exports = Auction;