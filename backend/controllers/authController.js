const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let refreshTokens = []
const authController = {
    registerUser: async (req, res) => {
        console.log("cow")
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            })
            console.log(newUser)
            const user = await newUser.save()
            res.status(200).json(user)
        }
        catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, 'mk', { expiresIn: "20s" })
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, 'mk_refresh', { expiresIn: "1d" })
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(404).json('Wrong username!')
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!validPassword) {
                return res.status(404).json('Wrong password')
            }
            if (user && validPassword) {
                const accesstoken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                const { password, ...others } = user._doc
                res.status(200).json({ ...others, accesstoken, refreshToken })
            }
        }
        catch (err) {
            res.status(500).json(err)
        }
    },
    reqRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json("You're not authenticated")
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh Token is not valid")
        }
        jwt.verify(refreshToken, 'mk_refresh', (err, user) => {
            if (err) {
                console.log(err)
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            const newAccessToken = authController.generateAccessToken(user)
            const newRefreshToken = authController.generateRefreshToken(user)
            refreshTokens.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({ accesstoken: newAccessToken })

        })
    },
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken")
        res.status(200).json("Logout Success")
    }
}

module.exports = authController