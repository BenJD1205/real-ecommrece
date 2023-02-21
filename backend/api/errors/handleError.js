const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

const notFound = (req, res, next) => {
    const error = new Error(`Not found :${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    createError,
    notFound,
};
