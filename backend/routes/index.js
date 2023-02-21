const router = require("express").Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const blogRoutes = require("./blogRoutes");
const categoryRoutes = require("./categoryRoutes");
const bCategoryRoutes = require("./blogCatRoutes");
const brandRoutes = require("./brandRoutes");
const couponRoutes = require("./couponRoutes");
const colorRoutes = require("./colorRoutes");
const enqRoutes = require("./enqRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/blogs", blogRoutes);
router.use("/categories", categoryRoutes);
router.use("/bCategories", bCategoryRoutes);
router.use("/brands", brandRoutes);
router.use("/coupons", couponRoutes);
router.use("/colors", colorRoutes);
router.use("/enquiry", enqRoutes);

module.exports = router;
