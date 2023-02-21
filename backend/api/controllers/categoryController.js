const Category = require("../../models/categoryModel");
const validateMongoDbId = require("../validation/validateMongodbId");

module.exports = {
    getCategories: async (req, res, next) => {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (err) {
            next(err);
        }
    },
    getCategory: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const category = await Category.findById(id);
            res.json(category);
        } catch (err) {
            next(err);
        }
    },
    createCategory: async (req, res, next) => {
        try {
            const newCategory = await Category.create(req.body);
            res.json(newCategory);
        } catch (err) {
            next(err);
        }
    },
    updateCategory: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const updatedCategory = await Category.findOneAndUpdate(
                id,
                req.body,
                { new: true }
            );
            res.json(updatedCategory);
        } catch (err) {
            next(err);
        }
    },
    deleteCategory: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            await Category.findByIdAndDelete(id);
            res.json("Category has been deleted!");
        } catch (err) {
            next(err);
        }
    },
};
