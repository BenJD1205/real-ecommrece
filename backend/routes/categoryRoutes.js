const router = require("express").Router();
const categoryController = require("../api/controllers/categoryController");
const { verifyTokenAndAdmin } = require("../api/middlewares/verifyPermission");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

router.use(verifyTokenAndAdmin);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
