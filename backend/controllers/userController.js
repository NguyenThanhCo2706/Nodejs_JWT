const User = require('../models/User')

const userController = {
    getAllUser: async (req, res) => {
        try {
            const users = await User.find()
            res.status(200).json(users)
        }
        catch (err) {
            res.status(500).json(err)
        }
    },
    deleteUser: async (req, res) => {
        try {
            let user = await User.findById(req.params.id);
            res.status(200).json("delete Success")
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = userController
