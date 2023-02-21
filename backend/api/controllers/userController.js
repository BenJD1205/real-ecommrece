const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Coupon = require("../../models/couponModel");
const Cart = require("../../models/cartModel");
const Order = require("../../models/orderModel");
const { createError } = require("../errors/handleError");
const validateMongoId = require("../validation/validateMongodbId");
const sendMailer = require("../../helper/sendMailer");
const crypto = require("crypto");
const uniqid = require("uniqid");

module.exports = {
    getAllUser: async (req, res, next) => {
        try {
            const getUsers = await User.find().populate("wishList");
            res.json(getUsers);
        } catch (err) {
            next(err);
        }
    },
    getWishList: async (req, res, next) => {
        const { id } = req.user;
        try {
            const findUser = await User.findById(id).populate("wishList");
            res.json(findUser);
        } catch (err) {
            next(err);
        }
    },
    getUser: async (req, res, next) => {
        const { id } = req.params;
        validateMongoId(id, next);
        try {
            const user = await User.findById(id);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
    getUserCart: async (req, res, next) => {
        const { id } = req.user;
        validateMongoId(id, next);
        try {
            const cart = await Cart.findOne({ orderBy: id }).populate(
                "products.product"
            );
            res.json(cart);
        } catch (err) {
            next(err);
        }
    },
    getOrders: async (req, res, next) => {
        const { id } = req.user;
        validateMongoId(id, next);
        try {
            const userOrders = await Order.findOne({ orderBy: id })
                .populate("products.product")
                .exec();
            res.json(userOrders);
        } catch (err) {
            next(err);
        }
    },
    deleteUser: async (req, res, next) => {
        const { id } = req.params;
        validateMongoId(id, next);
        try {
            await User.findByIdAndDelete(id);
            res.json({ message: "User has been deleted!" });
        } catch (err) {
            next(err);
        }
    },
    updateUser: async (req, res, next) => {
        const { id } = req.params;
        validateMongoId(id, next);
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { ...req.body },
                { new: true }
            );
            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    },
    blockUser: async (req, res, next) => {
        const { id } = req.params;
        validateMongoId(id, next);
        try {
            await User.findByIdAndUpdate(
                id,
                { isBlocked: true },
                { new: true }
            );
            res.json({ message: "User has been blocked!" });
        } catch (err) {
            next(err);
        }
    },
    unblockUser: async (req, res, next) => {
        const { id } = req.params;
        validateMongoId(id, next);
        try {
            await User.findByIdAndUpdate(
                id,
                { isBlocked: false },
                { new: true }
            );
            res.json({ message: "User has been unblocked!" });
        } catch (err) {
            next(err);
        }
    },
    updatePassword: async (req, res, next) => {
        const { id } = req.user;
        const { password } = req.body;
        validateMongoId(id, next);
        try {
            let user = await User.findById(id);
            if (password) {
                user.password = password;
                const updatedUser = await user.save();
                res.json(updatedUser);
            } else {
                res.json(user);
            }
        } catch (err) {
            next(err);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user)
                return next(
                    createError(404, "User not found with this email!")
                );
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetURL = `
                Hi, please follow this link to reset your password. this link is valid till 10 minutes from now.
                <a href="http://localhost:5001/api/users/reset-password/${token}">Click here</a>
            `;
            const data = {
                to: email,
                text: "Hey user",
                subject: "Forgot password link",
                html: resetURL,
            };
            sendMailer(data);
            res.json(token);
        } catch (err) {
            next(err);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { password } = req.body;
            const { token } = req.params;
            const hashedToken = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");
            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() },
            });
            if (!user)
                return next(createError("Token expired, please try again!"));
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
    saveAddress: async (req, res, next) => {
        const { id } = req.user;
        validateMongoId(id, next);
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                {
                    address: req.body.address,
                },
                { new: true }
            );
            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    },
    userAddCart: async (req, res, next) => {
        const { cart } = req.body;
        const { id } = req.user;
        validateMongoId(id, next);
        try {
            let products = [];
            const user = await User.findById(id);
            //check if user already have product in cart
            const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
            if (alreadyExistCart) {
                alreadyExistCart.remove();
            }
            for (let i = 0; i < cart.length; i++) {
                let obj = {};
                obj.product = cart[i]._id;
                obj.count = cart[i].count;
                obj.color = cart[i].color;
                let getPrice = await Product.findById(cart[i]._id)
                    .select("price")
                    .exec();
                obj.price = getPrice.price;
                products.push(obj);
            }
            let cartTotal = 0;
            for (let i = 0; i < products.length; i++) {
                cartTotal = cartTotal + products[i].price * products[i].count;
            }
            let newCart = await new Cart({
                products,
                cartTotal,
                orderBy: user?._id,
            }).save();
            res.json(newCart);
        } catch (err) {
            next(err);
        }
    },
    emptyCart: async (req, res, next) => {
        const { id } = req.user;
        validateMongoId(id);
        try {
            const user = await User.findById(id);
            const cart = await Cart.findOneAndRemove({ orderBy: user._id });
            res.json(cart);
        } catch (err) {
            next(err);
        }
    },
    applyCoupon: async (req, res, next) => {
        const { coupon } = req.body;
        const { id } = req.user;
        validateMongoId(id, next);
        try {
            const validCoupon = await Coupon.findOne({ name: coupon });
            if (validCoupon === null) {
                return next(createError(404, "Invalid coupon"));
            }
            // const user = await User.findOne({ _id: id });
            const user = await User.findById(id);
            //check if user already have product in cart
            const { cartTotal } = await Cart.findOne({
                orderBy: user._id,
            }).populate("products.product");
            let totalAfterDiscount = (
                cartTotal -
                (cartTotal * validCoupon.discount) / 100
            ).toFixed(2);
            await Cart.findOneAndUpdate(
                { orderBy: user._id },
                { totalAfterDiscount },
                { new: true }
            );
            res.json(totalAfterDiscount);
        } catch (err) {
            next(err);
        }
    },
    createOrder: async (req, res, next) => {
        const { COD, couponApplied } = req.body;
        const { id } = req.user;
        try {
            if (!COD)
                return next(createError(404, "Create cash order failed!"));
            const user = await User.findById(id);
            let userCart = await Cart.findOne({ orderBy: user._id });
            let finalAmount = 0;
            if (couponApplied && userCart.totalAfterDiscount) {
                finalAmount = userCart.totalAfterDiscount;
            } else {
                finalAmount = userCart.cartTotal * 100;
            }
            let newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(),
                    method: "COD",
                    amount: finalAmount,
                    status: "Cash on Delivery",
                    created: Date.now(),
                    currency: "usd",
                },
                orderBy: user._id,
                orderStatus: "Cash on Delivery",
            }).save();
            let update = userCart.products.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item.product._id },
                        update: {
                            $inc: { quantity: -item.count, sold: +item.count },
                        },
                    },
                };
            });
            const updated = await Product.bulkWrite(update, {});
            res.json({ messsage: "success" });
        } catch (err) {
            next(err);
        }
    },
    updateOrderStatus: async (req, res, next) => {
        const { status } = req.body;
        const { id } = req.params;
        validateMongoId(id);
        try {
            const updateOrderStatus = await Order.findByIdAndUpdate(
                id,
                {
                    orderStatus: status,
                    paymentIntent: {
                        status: status,
                    },
                },
                { new: true }
            );
            res.json(updateOrderStatus);
        } catch (err) {
            next(err);
        }
    },
};
