const Color = require("../../models/colorModel");
const validateMongoDbId = require("../validation/validateMongodbId");

module.exports = {
    getColors: async (req, res, next) => {
        try {
            const Colors = await Color.find();
            res.json(Colors);
        } catch (err) {
            next(err);
        }
    },
    getColor: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const color = await Color.findById(id);
            res.json(color);
        } catch (err) {
            next(err);
        }
    },
    createColor: async (req, res, next) => {
        try {
            const newColor = await Color.create(req.body);
            res.json(newColor);
        } catch (err) {
            next(err);
        }
    },
    updateColor: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const updatedColor = await Color.findOneAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updatedColor);
        } catch (err) {
            next(err);
        }
    },
    deleteColor: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            await Color.findByIdAndDelete(id);
            res.json("Color has been deleted!");
        } catch (err) {
            next(err);
        }
    },
};
