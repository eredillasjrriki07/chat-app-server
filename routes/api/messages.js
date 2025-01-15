const express = require('express');
const router = express.Router();
const messagesController = require('../../controller/messageController');

router.route('/:conversationId')
    .get(messagesController.getMessages)
    .post(messagesController.postMessage)
    .put(messagesController.updateMessage);

module.exports = router;