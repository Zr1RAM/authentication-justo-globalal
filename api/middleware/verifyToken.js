const { StatusCodes } = require("http-status-codes");
const { decryptToken } = require("../util/passwordHasher");
const { isUserLocked } = require("../db");

const authenticateUser = async (req, res, next) => {
    let token;
    
    if(req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if(req.headers.accesstoken) {
        token = req.headers.accesstoken.split(" ")[1];
    } else if(req.query.accessToken) {
        token = req.query.accessToken
    }


    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json('Not logged in!');
    }

    try {
        token = decryptToken(token);
    } catch (error) {
        // console.error(error);
        return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorized: Invalid Token');
    }
    
    
    // console.log(token);
    const {username, id, isAdmin, expiresAt} = token;

    const userLockedStatus = await isUserLocked(id);
    console.log(`user ${id} status: ${userLockedStatus.isLocked}`);
    if(userLockedStatus.isLocked === 1) {
        return res.status(StatusCodes.LOCKED).json('User locked, contact admin');
    }

    const currentTimestamp = Date.now();
    if(currentTimestamp > expiresAt) {
        return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorized: Token has expired');
    }

    req.userInfo = { username, id, isAdmin };
    // console.log("valid Token");
    next();

};

module.exports = authenticateUser;