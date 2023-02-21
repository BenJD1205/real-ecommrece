const router = require("express").Router();
const productController = require("../api/controllers/productController");
const {
    verifyTokenAndAdmin,
    verifyToken,
} = require("../api/middlewares/verifyPermission");
const {
    uploadPhoto,
    productImgResize,
} = require("../api/middlewares/uploadImages");

router.get("/:id", verifyToken, productController.getProduct);
router.get("/", verifyToken, productController.getProducts);
router.put("/wishlist", verifyToken, productController.addToWishList);
router.put("/rating", verifyToken, productController.rating);

router.use(verifyTokenAndAdmin);
router.post("/", productController.createProduct);
router.put(
    "/upload/:id",
    uploadPhoto.array("images", 10),
    productImgResize,
    productController.uploadImages
);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.delete("/delete-img/:id", productController.deleteImages);

module.exports = router;
