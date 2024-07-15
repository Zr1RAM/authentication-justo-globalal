const { LINK_EXPIRY, MAX_ATTEMPTS } = require("./constants");

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./database.db');

const insertUser = async (credentials, callback) => {
    const {username, password} = credentials;
    // console.log(credentials);
    try {
        const sql = `INSERT INTO users (username, password) 
                     VALUES (?, ?)`;
        await db.run(sql, [username, password], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { id: this.lastID, user: this });
            }
        });
    } catch (err) {
        callback(err);
    }
};

const authenticateUser = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;

    db.get(sql, [username], (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(new Error('User not found'));
        callback(null, user);
    });
};

const clearExpiredTokenLinks = () => {
    const sql = `DELETE FROM one_time_links where expiry < ?`
    // console.log(Date.now());
    db.run(sql, [Date.now()], (err) => {
      if(err) {
        return console.error(err.message);
      }
      console.log(`Rows deleted: ${this.changes}`);
    });
    // console.log(`Calling one_times_links table cleanup... this should happen once every ${LINK_EXPIRY} minutes`);
    setTimeout(clearExpiredTokenLinks, LINK_EXPIRY * 60 * 1000);
}

const onLoginAttemptFailed = (username, maxAttempts) => {
    const isLocked = maxAttempts === MAX_ATTEMPTS ? 1 : 0;
    const sql = `UPDATE users SET isLocked = ?, maxAttempts = ? where username = ?`;
    db.run(sql, [isLocked, maxAttempts + 1, username], (err) => {
        if(err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`)
    });
}

const getUsersDB = (callback) => {
    const sql = "SELECT id, username, isAdmin, isLocked, maxAttempts FROM users";
    db.all(sql, (err, rows) => {
        if (err) return callback(err);
        // console.log(rows);
        callback(null, rows);
    })
}

const editUserDB = (user, callback) => {
    const { id, isLocked, isAdmin, maxAttempts } = user;
    const sql = `UPDATE users SET isLocked = ?, isAdmin = ?, maxAttempts = ? WHERE id = ?`;
    db.run(sql, [isLocked, isAdmin, maxAttempts, id], (err) => {
        if(err) return callback(err);
        callback(null, this.changes);
    });
}

db.getAsync = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if(err) {
                return reject(err);
            }
            resolve(row);
        })
    });
}

const isUserLocked = async (id) => {
    console.log(`id: ${id}`);
    const sql = `SELECT isLocked FROM users WHERE id = ?`;
    try {
        const result = await db.getAsync(sql, [id]);
        return result;
    } catch (err) {
        throw err;
    }
};


module.exports = {db, insertUser, authenticateUser, clearExpiredTokenLinks, onLoginAttemptFailed, getUsersDB, editUserDB, isUserLocked};


