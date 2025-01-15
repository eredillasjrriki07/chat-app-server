const Message = require('../model/Message');
const Conversation = require('../model/conversation');
const { v4: uuidv4 } = require('uuid');

const getMessages = async (req, res) => {

    if (!req?.params?.conversationId) return res.status(400).json({ 'message': 'conversationId is required.' });

    const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ 'timestamp': 1 });;

    if (messages.length === 0) {

        return res.status(204).json({ 'message': `Conversation ID ${req.params.conversationId} not found.` });
    }

    res.json(messages);

}

const postMessage = async (req, res) => {

    try {

        await Message.create({
            ...req.body,
            "messageId": uuidv4(),
        });

        res.status(201).json({ 'success': 'Message sent.' });

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }

}

const updateMessage = async (req, res) => {

    try {

        const { userId, conversationId } = req.body;

        const filter = {
            conversationId: conversationId,
            readBy: { $nin: [userId] }
        };

        await Conversation.updateMany(
            {
                ...filter,
                "lastMessage.readBy": { $nin: [userId] }
            },
            {
                $addToSet: {
                    "lastMessage.readBy": userId
                }
            } // Ensures the value is added only if it doesn't already exist
        );

        await Message.updateMany(
            filter,
            {
                $addToSet: {
                    readBy: userId
                }
            } // Ensures the value is added only if it doesn't already exist
        );

        res.status(201).json({ 'success': 'Message updated.' });

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }
}

module.exports = {
    getMessages,
    postMessage,
    updateMessage,
}