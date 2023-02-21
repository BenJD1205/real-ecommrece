const router = require("express").Router();
const couponController = require("../api/controllers/couponController");
const {
    verifyTokenAndAdmin,
    verifyToken,
} = require("../api/middlewares/verifyPermission");

router.get("/", verifyToken, couponController.getAllCoupons);

router.use(verifyTokenAndAdmin);
router.post("/", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
