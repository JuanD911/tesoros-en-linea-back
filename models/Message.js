const mongoose = require('mongoose');

// Se define el esquema del modelo 'Mensaje {Message}' para enviar al cluster de: MongoDB Atlas.
const messageSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    user_id: {
        type: String, 
        required: true
    },
    text: {
        type: String, 
        required: true
    },
    auction_id: {
        type: String, 
        required: true
    },

}, { timestamps:true })

const Message = mongoose.model('message', messageSchema);
module.exports = Message;