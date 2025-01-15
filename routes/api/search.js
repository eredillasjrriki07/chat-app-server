const express = require('express');
const router = express.Router();
const searchController = require('../../controller/searchController');

router.route('/')
    .get(searchController.searchUser);


module.exports = router;