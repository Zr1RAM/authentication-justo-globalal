const crypto = require('crypto');
const { TOKEN_EXPIRY } = require('../constants');

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    // console.log({salt, hash});
    return `${salt}:${hash}`;
};

const verifyPassword = (password, hashWithSalt) => {
    const [salt, originalHash] = hashWithSalt.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    // console.log({hash, originalHash});
    return hash === originalHash;
};

const secretKey = process.env.SECRET_KEY || "my-secret-key";

const generateToken = ({username, id, isAdmin}) => {
    const payload = JSON.stringify({ 
        username, 
        id, 
        isAdmin,
        expiresAt: Date.now() + TOKEN_EXPIRY * 60 * 1000
    });
    const cipher = crypto.createCipher('aes-256-ctr', secretKey);
    let token = cipher.update(payload, 'utf8', 'hex');
    token += cipher.final('hex');
    return token;
}

const decryptToken = (token) => {
    const decipher = crypto.createDecipher('aes-256-ctr', secretKey);
    let decrypted = decipher.update(token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

module.exports = {hashPassword, verifyPassword, generateToken, decryptToken};