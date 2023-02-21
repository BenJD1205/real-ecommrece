const mongoose = require("mongoose");
const { createError } = require("../errors/handleError");

const validateMongoDbId = async (id, next) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid)
        return next(createError(404, "This id is not valid or not found!"));
};

module.exports = validateMongoDbId;
