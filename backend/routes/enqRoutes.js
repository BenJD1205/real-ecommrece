const router = require("express").Router();
const enqController = require("../api/controllers/enqController");
const { verifyTokenAndAdmin } = require("../api/middlewares/verifyPermission");

router.get("/:id", enqController.getEnq);
router.get("/", enqController.getAllEnq);

router.use(verifyTokenAndAdmin);
router.post("/", enqController.createEnq);
router.put("/:id", enqController.updateEnq);
router.delete("/:id", enqController.deleteEnq);

module.exports = router;
