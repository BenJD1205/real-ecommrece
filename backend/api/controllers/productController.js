const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const slugify = require("slugify");
const { createError } = require("../errors/handleError");
const validateMongDbId = require("../validation/validateMongodbId");
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../../utils/cloudinary");
const fs = require("fs");

module.exports = {
    getProduct: async (req, res, next) => {
        const { id } = req.params;
        try {
            const findProduct = await Product.findById(id);
            res.json(findProduct);
        } catch (err) {
            next(err);
        }
    },
    getProducts: async (req, res, next) => {
        try {
            ///filtering
            const queryObj = { ...req.query };
            const excludeFields = ["page", "sort", "limit", "fields"];
            excludeFields.forEach((el) => delete queryObj[el]);
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(
                /\b(gte|gt|lte|lt)\b/g,
                (match) => `$${match}`
            );
            let query = Product.find(JSON.parse(queryStr));

            //sorting
            if (req.query.sort) {
                const sortBy = req.query.sort.split(",").join(" ");
                query = query.sort(sortBy);
            } else {
                query = query.sort("-createdAt");
            }

            //limiting the fields
            if (req.query.fields) {
                const fields = req.query.fields.split(",").join(" ");
                query = query.select(fields);
            } else {
                query = query.select("-__v");
            }

            //pagination
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);

            if (req.query.page) {
                const productCount = await Product.countDocuments();
                if (skip >= productCount) {
                    return next(createError(404, "This page does not exist!"));
                }
            }

            const products = await query;
            res.json(products);
        } catch (err) {
            next(err);
        }
    },
    createProduct: async (req, res, next) => {
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title);
            }
            const newProduct = await Product.create(req.body);
            res.json(newProduct);
        } catch (err) {
            next(err);
        }
    },
    updateProduct: async (req, res, next) => {
        const { id } = req.params;
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title);
            }
            const updateProduct = await Product.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );
            res.json(updateProduct);
        } catch (err) {
            next(err);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            await Product.findByIdAndDelete(id);
            res.json({ message: "Product has been deleted!" });
        } catch (err) {
            next(err);
        }
    },
    addToWishList: async (req, res, next) => {
        try {
            const { id } = req.user;
            const { prodId } = req.body;
            const user = await User.findById(id);
            const alreadyAdded = user.wishList.find(
                (id) => id.toString() === prodId
            );
            if (alreadyAdded) {
                let user = await User.findByIdAndUpdate(
                    id,
                    {
                        $pull: { wishList: prodId },
                    },
                    { new: true }
                );
                res.json(user);
            } else {
                let user = await User.findByIdAndUpdate(
                    id,
                    {
                        $push: { wishList: prodId },
                    },
                    { new: true }
                );
                res.json(user);
            }
        } catch (err) {
            next(err);
        }
    },
    rating: async (req, res, next) => {
        const { id } = req.user;
        const { star, prodId, comment } = req.body;
        try {
            const product = await Product.findById(prodId);
            let alreadyRated = product.ratings.find(
                (userId) => userId.postedBy.toString() === id.toString()
            );
            if (alreadyRated) {
                const updateRating = await Product.updateOne(
                    {
                        ratings: { $elemMatch: alreadyRated },
                    },
                    {
                        $set: {
                            "ratings.$.star": star,
                            "ratings.$.comment": comment,
                        },
                    },
                    { new: true }
                );
            } else {
                const rateProduct = await Product.findByIdAndUpdate(
                    prodId,
                    {
                        $push: {
                            ratings: {
                                star: star,
                                comment: comment,
                                postedBy: id,
                            },
                        },
                    },
                    { new: true }
                );
            }
            const getAllRatings = await Product.findById(prodId);
            let totalRating = getAllRatings.ratings.length;
            let ratingSum = getAllRatings.ratings
                .map((item) => item.star)
                .reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingSum / totalRating);
            const finalProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    totalRating: actualRating,
                },
                { new: true }
            );
            res.json(finalProduct);
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
            const images = urls.map((file) => {
                return file;
            });
            res.json(images);
        } catch (err) {
            next(err);
        }
    },
    deleteImages: async (req, res, next) => {
        const { id } = req.params;
        validateMongDbId(id, next);
        try {
            const deleted = (path) => cloudinaryDeleteImg(path, "images");
            res.json({ message: "Deleted" });
        } catch (err) {
            next(err);
        }
    },
};
