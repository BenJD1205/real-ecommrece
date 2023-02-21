const Blog = require("../../models/blogModel");
const validateMongoDbId = require("../validation/validateMongodbId");
const { cloudinaryUploadImg } = require("../../utils/cloudinary");
const validateMongDbId = require("../validation/validateMongodbId");
const fs = require("fs");

module.exports = {
    getBlog: async (req, res, next) => {
        const { id } = req.params;
        try {
            const getBlog = await Blog.findById(id)
                .populate("likes")
                .populate("dislikes");
            const updateViews = await Blog.findByIdAndUpdate(
                id,
                { $inc: { numViews: 1 } },
                { new: true }
            );
            res.json(getBlog);
        } catch (err) {
            next(err);
        }
    },
    getBlogs: async (req, res, next) => {
        try {
            const getBlogs = await Blog.find();
            res.json(getBlogs);
        } catch (err) {
            next(err);
        }
    },
    createBlog: async (req, res, next) => {
        try {
            const newBlog = await Blog.create(req.body);
            res.json({
                newBlog,
            });
        } catch (err) {
            next(err);
        }
    },
    updateBlog: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updatedBlog);
        } catch (err) {
            next(err);
        }
    },
    deleteBlog: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            await Blog.findByIdAndDelete(id);
            res.json("Blog has been deleted!");
        } catch (err) {
            next(err);
        }
    },
    likeBlog: async (req, res, next) => {
        const { blogId } = req.body;
        validateMongoDbId(blogId, next);
        try {
            //Find the blog which you want to be liked
            const blog = await Blog.findById(blogId);
            //find the login user
            const loginUserId = req?.user?.id;

            const isLiked = blog?.isLiked;

            const alreadyLiked = blog?.dislikes?.find(
                (userId) => userId?.toString() === loginUserId?.toString()
            );
            if (alreadyLiked) {
                const blog = await Blog.findByIdAndUpdate(
                    blogId,
                    {
                        $pull: { dislikes: loginUserId },
                        isDisliked: false,
                    },
                    { new: true }
                );
                res.json(blog);
            }

            if (isLiked) {
                const blog = await Blog.findByIdAndUpdate(
                    blogId,
                    {
                        $pull: { likes: loginUserId },
                        isLiked: false,
                    },
                    { new: true }
                );
                res.json(blog);
            } else {
                const blog = await Blog.findByIdAndUpdate(
                    blogId,
                    {
                        $push: { likes: loginUserId },
                        isLiked: true,
                    },
                    { new: true }
                );
                res.json(blog);
            }
        } catch (err) {
            next(err);
        }
    },
    dislikeBlog: async (req, res, next) => {
        const { blogId } = req.body;
        validateMongoDbId(blogId, next);
        try {
            //Find the blog which you want to be liked
            const blog = await Blog.findById(blogId);
            //find the login user
            const loginUserId = req?.user?.id;

            const isDisLiked = blog?.isDisliked;

            const alreadyLiked = blog?.likes?.find(
                (userId) => userId?.toString() === loginUserId?.toString()
            );
            if (alreadyLiked) {
                const blog = await Blog.findByIdAndUpdate(
                    blogId,
                    {
                        $pull: { likes: loginUserId },
                        isLiked: false,
                    },
                    { new: true }
                );
                res.json(blog);
            }

            if (isDisLiked) {
                const blog = await Blog.findByIdAndUpdate(
                    blogId,
                    {
                        $pull: { dislikes: loginUserId },
                        isDisliked: false,
                    },
                    { new: true }
                );
                res.json(blog);
            } else {
                const blog = await Blog.findByIdAndUpdate(
                    blogId,
                    {
                        $push: { dislikes: loginUserId },
                        isDisliked: true,
                    },
                    { new: true }
                );
                res.json(blog);
            }
        } catch (err) {
            next(err);
        }
    },
    uploadImages: async (req, res, next) => {
        const { id } = req.params;
        validateMongDbId(id, next);
        try {
            const uploader = (path) => cloudinaryUploadImg(path, "images");
            const urls = [];
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }
            const findBlog = await Blog.findByIdAndUpdate(
                id,
                {
                    images: urls.map((file) => {
                        return file;
                    }),
                },
                { new: true }
            );
            res.json(findBlog);
        } catch (err) {
            next(err);
        }
    },
};
