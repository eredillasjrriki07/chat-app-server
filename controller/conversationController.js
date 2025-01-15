const Conversation = require('../model/conversation');
const { v4: uuidv4 } = require('uuid');

const getConversations = async (req, res) => {

    const { userId } = req.body;

    if (!userId) return res.status(400).json({ 'message': 'userId is required.' });

    const conversations = await Conversation.find({ "participants.userId": userId }).sort({ 'lastMessage.timestamp': -1 });

    res.json(conversations);

}

const getConversationWithIds = async (req, res) => {

    const { participants } = req.body;

    try {

        const conversation = await Conversation.findOne({
            'participants.userId': { $all: participants }
        });

        res.json({ conversationId: conversation.conversationId });

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }

}

const postConversation = async (req, res) => {

    const { newConversation } = req.body;

    try {

        const conversationId = uuidv4();

        await Conversation.create({
            ...newConversation,
            conversationId,
        });

        res.status(201).json({
            'success': 'Conversation added.',
            'conversationId': conversationId,
        });

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }

}

const updateConversation = async (req, res) => {

    try {

        if (!req?.params?.conversationId) return res.status(400).json({ 'message': 'conversationId is required.' });

        const conversationId = req.params.conversationId;

        const foundConversation = await Conversation.findOne({ conversationId }).exec();

        if (!foundConversation) return res.sendStatus(403); // Forbidden

        foundConversation.lastMessage = req.body;

        await foundConversation.save();

        res.sendStatus(204);

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }

}

module.exports = {
    getConversations,
    getConversationWithIds,
    postConversation,
    updateConversation,
}