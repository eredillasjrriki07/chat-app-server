const User = require('../model/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {

    const { username, pwd } = req.body;

    if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: username }).exec();

    if (!foundUser) return res.sendStatus(401); // Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": foundUser.userId,
                    "username": foundUser.username,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' },
        );

        const refreshToken = jwt.sign(
            {
                "userId": foundUser.userId,
                "username": foundUser.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send accessToken to user
        res.json({ firstname: foundUser.firstname, lastname: foundUser.lastname, userId: foundUser.userId, accessToken: accessToken });

    } else {

        res.sendStatus(401);

    }

}

module.exports = { handleLogin }