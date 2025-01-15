const User = require('../model/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const handleRegister = async (req, res) => {

    const { username, pwd, firstname, lastname } = req.body;

    if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Check for duplicate usernames in the db
    const duplicate = await User.findOne({ username }).exec();

    if (duplicate) return res.sendStatus(409); // Status for Conflict

    try {

        // Password encrypting
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Create and store the new user
        const result = await User.create({
            "userId": uuidv4(),
            "username": username,
            "password": hashedPwd,
            "firstname": firstname,
            "lastname": lastname,
        });

        res.status(201).json({ 'success': `New user ${username} created.` });

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }
}

module.exports = { handleRegister }