const User = require('../model/user');

const searchUser = async (req, res) => {

    const { query, user_id } = req.query;

    if (!query) return res.status(400).json({ error: 'Query parameter is required.' });

    try {

        const users = await User.find({
            $and: [
                {
                    $or: [
                        { firstname: { $regex: query, $options: 'i' } },
                        { lastname: { $regex: query, $options: 'i' } },
                    ],
                },
                {
                    userId: { $nin: [user_id] },
                },
            ],
        }).select('userId firstname lastname');

        res.json(users);

    } catch (error) {

        res.status(500).json({ 'message': error.message });

    }

}

module.exports = { searchUser }