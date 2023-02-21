const Brand = require("../../models/brandModel");
const validateMongoDbId = require("../validation/validateMongodbId");

module.exports = {
    getBrands: async (req, res, next) => {
        try {
            const brands = await Brand.find();
            res.json(brands);
        } catch (err) {
            next(err);
        }
    },
    getBrand: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const brand = await Brand.findById(id);
            res.json(brand);
        } catch (err) {
            next(err);
        }
    },
    createBrand: async (req, res, next) => {
        try {
            const newBrand = await Brand.create(req.body);
            res.json(newBrand);
        } catch (err) {
            next(err);
        }
    },
    updateBrand: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const updatedBrand = await Brand.findOneAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updatedBrand);
        } catch (err) {
            next(err);
        }
    },
    deleteBrand: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            await Brand.findByIdAndDelete(id);
            res.json("Brand has been deleted!");
        } catch (err) {
            next(err);
        }
    },
};
