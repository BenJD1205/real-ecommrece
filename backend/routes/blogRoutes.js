const router = require("express").Router();
const blogController = require("../api/controllers/blogController");
const {
    verifyTokenAndAdmin,
    verifyToken,
} = require("../api/middlewares/verifyPermission");
const {
    uploadPhoto,
    blogImgResize,
} = require("../api/middlewares/uploadImages");

router.get("/", verifyToken, blogController.getBlogs);
router.put("/like", verifyToken, blogController.likeBlog);
router.put("/dislike", verifyToken, blogController.dislikeBlog);
router.get("/:id", verifyToken, blogController.getBlog);

router.use(verifyTokenAndAdmin);
router.post("/", blogController.createBlog);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);
router.put(
    "/upload/:id",
    uploadPhoto.array("images", 2),
    blogImgResize,
    blogController.uploadImages
);

module.exports = router;
