const User = require("../../models/userModel");
const { createError } = require("../errors/handleError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtToken = require("../../helper/generateToken");
const generateRefreshToken = require("../../helper/refreshToken");

module.exports = {
    register: async (req, res, next) => {
        try {
            const email = req.body.email;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const findUser = await User.findOne({ email: email });
            if (findUser) return next(createError(400, "User Already Exist!"));
            const newUser = await User.create({
                ...req.body,
                password: hash,
            });
            const { password, ...others } = newUser._doc;
            res.json(others);
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const userExist = await User.findOne({ email });
            if (!userExist) {
                return next(createError(404, "User not found!"));
            }
            const isPasswordCorrect = await bcrypt.compare(
                password,
                userExist.password
            );
            if (!isPasswordCorrect)
                return next(createError(400, "Wrong password or username!"));
            const refreshToken = await generateRefreshToken(userExist._id);
            const updateUser = await User.findByIdAndUpdate(
                userExist.id,
                {
                    refreshToken: refreshToken,
                },
                { new: true }
            );
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.json(updateUser);
        } catch (err) {
            next(err);
        }
    },
    getTokenByRefreshToken: async (req, res, next) => {
        const cookie = req.cookies;
        if (!cookie?.refreshToken)
            next(404, "Not found refreshToken in Cookies!");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken });
        if (!user)
            return next(404, "No refresh token present in db or not matched!");
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id) {
                return next(
                    createError(
                        400,
                        "There is something wrong with refresh token!"
                    )
                );
            }
            const accessToken = jwtToken({
                id: user._id,
                isAdmin: user.isAdmin,
            });
            res.json({ accessToken });
        });
    },
    logout: async (req, res, next) => {
        try {
            const cookie = req.cookies;
            if (!cookie?.refreshToken)
                next(createError("No refresh token in cookies!"));
            const refreshToken = cookie.refreshToken;
            const user = await User.findOne({ refreshToken });
            if (!user) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                });
                return res.status(204).json("Clear token!");
            }
            await User.findOneAndUpdate(refreshToken, {
                refreshToken: "",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            return res.status(204).json("Clear token!");
        } catch (err) {
            next(err);
        }
    },
};
