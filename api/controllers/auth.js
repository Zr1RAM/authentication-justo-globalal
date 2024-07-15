const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../errors/custom-error");
const { insertUser, authenticateUser, db, onLoginAttemptFailed } = require("../db");
const asyncWrapper = require("../middleware/asyncWrapper");
const { hashPassword, verifyPassword, generateToken, decryptToken } = require("../util/passwordHasher");
const { LINK_EXPIRY, MAX_ATTEMPTS } = require("../constants");
const register = asyncWrapper(async (req, res, next) => {
    
    if(req.body.password.length < 5) {
        return next(createCustomError({msg: "password too short"}, StatusCodes.BAD_REQUEST));
    }
    req.body.password = hashPassword(req.body.password);
    // console.log(req.body.password);
    const {username, password} = req.body
    insertUser({username, password}, (err, result)=>{
        if (err) {
            console.error('Failed to insert user:', err.message);
            return next(createCustomError(err.message, StatusCodes.BAD_REQUEST));
        } else {
            console.log('User inserted with ID:', result);
            res.status(StatusCodes.CREATED).json({ msg: "new user registered", user: {result}});
            // insert login logic here if you want to immediately authenticate the user after registration
        }
    });
});

const login = asyncWrapper(async (req, res, next) => {
    const {username, password} = req.body;
    authenticateUser(username, (err, result) => {
        if(err) {
            console.error('user not found:', err.message);
            return next(createCustomError("Invalid username or password", StatusCodes.UNAUTHORIZED));   
        } else {
            // console.log(result);
            if(result.isLocked === 1 || result.maxAttempts >= MAX_ATTEMPTS) {
                return next(createCustomError("Too many attempts, user account locked. Request admin to unlock", StatusCodes.LOCKED));
            }

            if(verifyPassword(password, result.password)) {
                const {password, ...userInfo} = result;
                const accessToken = generateToken({
                    username: result.username,
                    id: result.id,
                    isAdmin: result.isAdmin

                });
                return res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true,
                })
                .status(StatusCodes.OK)
                .json({ msg: "Login success", user: {userInfo}});
            } else {
                onLoginAttemptFailed(result.username, result.maxAttempts);
                return next(createCustomError("Invalid username or password", StatusCodes.UNAUTHORIZED));
            }
        }
    });
});

const logout = (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.status(StatusCodes.OK).json('Logged out successfully');
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('An error occurred during logout');
    }
};

const generateLink = asyncWrapper(async (req, res, next) => {
    const { username } = req.body;
    const expiry = Date.now() + LINK_EXPIRY * 60 * 1000;
    authenticateUser(username, (err, result) => {
        if(err) {
            console.error('user not found:', err.message);
            return next(createCustomError("Invalid username", StatusCodes.UNAUTHORIZED));   
        } else {

            if(result.isLocked === 1) {
                // console.log('user is locked');
                return next(createCustomError("Can't generate link, user is locked", StatusCodes.LOCKED));
            }

            const token = generateToken({
                username: result.username,
                id: result.id,
                isAdmin: result.isAdmin
            });
            // const link = `${req.protocol}://${req.get('host')}/api/auth/verify-link/${token}`;
            // console.log(link);
            db.run('INSERT INTO one_time_links (token, username, isUsed, expiry) VALUES (?, ?, 0, ?)', [token, username, expiry]);
            res.status(StatusCodes.OK).json({ link: token });
        }
    })
});

const verifyLink = asyncWrapper(async (req, res, next) => {
    const { token } = req.params;
    db.get('SELECT * FROM one_time_links WHERE token = ?', [token], (err, row) => {
        if (err || !row) {
          return res.status(400).json({ error: 'Invalid or expired link' });
        }
    
        if (row.isUsed || row.expiry < Date.now()) {
          return res.status(400).json({ error: 'Link has already been used or expired' });
        }
    
        db.run('UPDATE one_time_links SET isUsed = 1 WHERE token = ?', [token], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update link usage' });
          }
        //   console.log(decryptToken(token));
        const { username, id, isAdmin } = decryptToken(token);
            return res.cookie("accessToken", token, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
            })
            .status(StatusCodes.OK)
            .json({ message: 'Link is valid', user: { username, id, isAdmin } });
        });
      });
});

module.exports = { register, login, generateLink, verifyLink, logout };