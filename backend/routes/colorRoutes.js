const router = require("express").Router();
const colorController = require("../api/controllers//colorController");
const { verifyTokenAndAdmin } = require("../api/middlewares/verifyPermission");

router.get("/:id", colorController.getColor);
router.get("/", colorController.getColors);

router.use(verifyTokenAndAdmin);
router.post("/", colorController.createColor);
router.put("/:id", colorController.updateColor);
router.delete("/:id", colorController.deleteColor);

module.exports = router;
