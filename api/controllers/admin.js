const { StatusCodes } = require("http-status-codes");
const { getUsersDB, editUserDB } = require("../db");
const asyncWrapper = require("../middleware/asyncWrapper");

const getUsers = asyncWrapper(async (req, res, next) => {
    getUsersDB((err, result) => {
        if (err) {
            console.error('Failed to get users', err.message);
            return next(createCustomError('Failed to get users', StatusCodes.INTERNAL_SERVER_ERROR));
        } else {
            // console.log(result);
            res.status(StatusCodes.OK).json(result);
        }
    });
});

const editUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.body
    // const userId = req.params.id
    editUserDB(req.body, (err, result) => {
        if(err) {
            console.error(`Failed to lock user: ${id}`, err.message);
        }
        res.status(StatusCodes.OK).json(`${id} updated successfully`);
    })
});

module.exports = {
    getUsers,
    editUser
};