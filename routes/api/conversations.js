const express = require('express');
const router = express.Router();
const conversationController = require('../../controller/conversationController');

router.route('/')
    .post(conversationController.getConversations);

router.route('/f')
    .post(conversationController.getConversationWithIds);

router.route('/new')
    .post(conversationController.postConversation);

router.route('/:conversationId')
    .put(conversationController.updateConversation);

module.exports = router;