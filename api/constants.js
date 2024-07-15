const NUMBER_OF_ATTEMPTS = 5;
const LINK_EXPIRY = 5 // in minutes
const RATE_LIMIT_WINDOW = 15;
const MAX_REQUESTS_PER_WINDOW = 50;
const MAX_ATTEMPTS = 3;
const TOKEN_EXPIRY = 20 // minutes

module.exports = {
    NUMBER_OF_ATTEMPTS,
    LINK_EXPIRY,
    RATE_LIMIT_WINDOW,
    MAX_REQUESTS_PER_WINDOW,
    MAX_ATTEMPTS,
    TOKEN_EXPIRY
};