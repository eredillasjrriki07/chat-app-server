const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    messageId: {
        type: String,
        required: true,
    },
    conversationId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    readBy: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('Message', messageSchema);