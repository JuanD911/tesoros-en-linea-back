const mongoose = require('mongoose');

const ofertaSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    auction: {
        type: Schema.Types.ObjectId,
        ref: 'Subasta',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Oferta = mongoose.model('Oferta', ofertaSchema);
module.exports = Oferta;