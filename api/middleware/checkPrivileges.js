const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/custom-error");

const checkPrevileges = (req, res, next) => {
    if(req.userInfo.isAdmin) {
        next()
    } else {
        return next(createCustomError('need admin privileges', StatusCodes.FORBIDDEN));
    }
}

module.exports = checkPrevileges;