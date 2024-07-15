const { StatusCodes } = require("http-status-codes");
const { RATE_LIMIT_WINDOW, MAX_REQUESTS_PER_WINDOW } = require("../constants");

const rateLimiters = {};
const rateLimitWindow = RATE_LIMIT_WINDOW * 60 * 1000;

const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    if(!rateLimiters[ip]) {
        rateLimiters[ip] = {
            count: 1,
            firstRequestTime: Date.now()
        };
    } else {
        rateLimiters[ip].count += 1;
    }

    const elapsedTime = Date.now() - rateLimiters[ip].firstRequestTime;

    if(elapsedTime > rateLimitWindow) {
        // Reset the rate limiter for the IP after the time window has passed
        rateLimiters[ip] = {
            count: 1,
            firstRequestTime: Date.now()
        };
    } else if (rateLimiters[ip].count > MAX_REQUESTS_PER_WINDOW) {
        return res.status(StatusCodes.TOO_MANY_REQUESTS).json({ error: 'Too many requests, please try again later.' });
    }
    console.log(rateLimiters);

    next();

};

const clearRateLimiters = () => {
    for (let ip in rateLimiters) {
        delete rateLimiters[ip];
    }
}

module.exports = {
    rateLimiter,
    clearRateLimiters
}