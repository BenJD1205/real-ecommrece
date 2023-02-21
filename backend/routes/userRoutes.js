const router = require("express").Router();
const userController = require("../api/controllers/userController");
const {
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
    verifyToken,
} = require("../api/middlewares/verifyPermission");

router.post("/forgot-password", userController.forgotPassword);

router.put("/reset-password/:token", userController.resetPassword);

router.put(
    "/self/password",
    verifyTokenAndAuthorization,
    userController.updatePassword
);

router.post("/cart", verifyToken, userController.userAddCart);

router.post("/cart/applyCoupon", verifyToken, userController.applyCoupon);

router.post("/cart/cash-order", verifyToken, userController.createOrder);

router.put("/save-address", verifyToken, userController.saveAddress);

router.get("/wishlist", verifyToken, userController.getWishList);

router.get("/cart", verifyToken, userController.getUserCart);

router.get("/get-orders", verifyToken, userController.getOrders);

router.delete("/empty-cart", verifyToken, userController.emptyCart);

router.use(verifyTokenAndAdmin);
router.get("/", userController.getAllUser);

router.get("/:id", userController.getUser);

router.delete("/:id", userController.deleteUser);

router.put("/:id", userController.updateUser);

router.put("/block/:id", userController.blockUser);

router.put("/unblock/:id", userController.unblockUser);

router.put("/order/update-order/:id", userController.updateOrderStatus);

module.exports = router;
