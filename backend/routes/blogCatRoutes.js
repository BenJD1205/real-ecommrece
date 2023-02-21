const router = require("express").Router();
const blogCategoryController = require("../api/controllers/bCategoryController");
const { verifyTokenAndAdmin } = require("../api/middlewares/verifyPermission");

router.get("/:id", blogCategoryController.getBCategory);
router.get("/", blogCategoryController.getCategories);

router.use(verifyTokenAndAdmin);
router.post("/", blogCategoryController.createBCategory);
router.put("/:id", blogCategoryController.updateBCategory);
router.delete("/:id", blogCategoryController.deleteBCategory);

module.exports = router;
