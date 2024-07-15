const { StatusCodes } = require("http-status-codes")

const test = (req, res, next) => {
    res.status(StatusCodes.OK).json("allowed to stay in homepage");
}

module.exports = test;