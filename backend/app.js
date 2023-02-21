require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const dbConnect = require("./config/dbConnect");
const rateLimiterMiddleware = require("./api/middlewares/rate-limiter-middleware");
const { notFound } = require("./api/errors/handleError");
//routes
const routes = require("./routes");

const app = express();

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(morgan("combined"));
app.use(cookieParser());

//dbConnect
dbConnect();

//PORT
const PORT = process.env.PORT || 5001;

//rate-limiter
app.use(rateLimiterMiddleware);

//routes
app.use("/api/v1", routes);

//middleware error handle
app.use(notFound);
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
});

///server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
