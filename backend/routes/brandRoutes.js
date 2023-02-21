const router = require("express").Router();
const brandController = require("../api/controllers/brandController");
const { verifyTokenAndAdmin } = require("../api/middlewares/verifyPermission");

router.get("/:id", brandController.getBrand);
router.get("/", brandController.getBrands);

router.use(verifyTokenAndAdmin);
router.post("/", brandController.createBrand);
router.put("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

module.exports = router;
