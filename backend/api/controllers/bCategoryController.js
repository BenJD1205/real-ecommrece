const BCategory = require("../../models/bCateModel");
const validateMongoDbId = require("../validation/validateMongodbId");

module.exports = {
    getCategories: async (req, res, next) => {
        try {
            const categories = await BCategory.find();
            res.json(categories);
        } catch (err) {
            next(err);
        }
    },
    getBCategory: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const BCategory = await BCategory.findById(id);
            res.json(BCategory);
        } catch (err) {
            next(err);
        }
    },
    createBCategory: async (req, res, next) => {
        try {
            const newBCategory = await BCategory.create(req.body);
            res.json(newBCategory);
        } catch (err) {
            next(err);
        }
    },
    updateBCategory: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const updatedBCategory = await BCategory.findOneAndUpdate(
                id,
                req.body,
                { new: true }
            );
            res.json(updatedBCategory);
        } catch (err) {
            next(err);
        }
    },
    deleteBCategory: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            await BCategory.findByIdAndDelete(id);
            res.json("BCategory has been deleted!");
        } catch (err) {
            next(err);
        }
    },
};
