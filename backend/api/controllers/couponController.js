const Coupon = require("../../models/couponModel");
const validateMongDbId = require("../validation/validateMongodbId");

module.exports = {
    getAllCoupons: async (req, res, next) => {
        try {
            const coupons = await Coupon.find();
            res.json(coupons);
        } catch (err) {
            next(err);
        }
    },
    createCoupon: async (req, res, next) => {
        try {
            const newCoupon = await Coupon.create(req.body);
            res.json(newCoupon);
        } catch (err) {
            next(err);
        }
    },
    updateCoupon: async (req, res, next) => {
        const { id } = req.params;
        validateMongDbId(id);
        try {
            const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updateCoupon);
        } catch (err) {
            next(err);
        }
    },
    deleteCoupon: async (req, res, next) => {
        const { id } = req.params;
        validateMongDbId(id);
        try {
            await Coupon.findByIdAndDelete(id);
            res.json({ message: "Coupon has been deleted!" });
        } catch (err) {
            next(err);
        }
    },
};
