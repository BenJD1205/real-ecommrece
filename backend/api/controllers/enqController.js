const Enq = require("../../models/enqModel");
const validateMongoDbId = require("../validation/validateMongodbId");

module.exports = {
    getAllEnq: async (req, res, next) => {
        try {
            const allEnq = await Enq.find();
            res.json(allEnq);
        } catch (err) {
            next(err);
        }
    },
    getEnq: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const enq = await Enq.findById(id);
            res.json(enq);
        } catch (err) {
            next(err);
        }
    },
    createEnq: async (req, res, next) => {
        try {
            const newEnq = await Enq.create(req.body);
            res.json(newEnq);
        } catch (err) {
            next(err);
        }
    },
    updateEnq: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            const updatedEnq = await Enq.findOneAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updatedEnq);
        } catch (err) {
            next(err);
        }
    },
    deleteEnq: async (req, res, next) => {
        const { id } = req.params;
        validateMongoDbId(id, next);
        try {
            await Enq.findByIdAndDelete(id);
            res.json("Enq has been deleted!");
        } catch (err) {
            next(err);
        }
    },
};
