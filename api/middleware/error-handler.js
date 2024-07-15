const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {

    // Returns error message that we have defined in our endpoints
    if(err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    // Returns Default error message (if we havent mentioned one in our endpoints).
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Something went wrong, please try again'});
};

module.exports = errorHandlerMiddleware;