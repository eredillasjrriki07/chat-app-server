const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LastMessageSchema = new Schema({
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

const ParticipantsSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const conversationSchema = new Schema({
    conversationId: {
        type: String,
        required: true,
    },
    participants: {
        type: [ParticipantsSchema],
        required: true,
    },
    lastMessage: {
        type: LastMessageSchema,
        required: false
    },
});

module.exports = mongoose.model('Conversation', conversationSchema);