const mongoose = require('mongoose');

// Se define el esquema del modelo 'Subasta (Auction)' para enviar al cluster de: MongoDB Atlas.
const auctionSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    initial_price: {
        type: Number,
        required: true
    },
    min_price: {
        type: Number,
        required: true
    },
    disponibility: {
        type: String,
        enum: ['privada', 'pública'],
        default: 'pública'
    }
});
const Subasta = mongoose.model('Subasta', subastaSchema);
module.exports = Subasta;