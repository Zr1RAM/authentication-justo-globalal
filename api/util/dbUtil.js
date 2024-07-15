const { db } = require("../db");

// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         isAdmin INTEGER DEFAULT 0 CHECK (isAdmin IN (0,1)),  -- Using INTEGER to represent boolean with constraint
//         isLocked INTEGER DEFAULT 0 CHECK (isLocked IN (0,1)),
//         maxAttempts INTEGER DEFAULT 0 CHECK (maxAttempts < 4)
//     )`);
// });



// db.run(`INSERT INTO users (username, password, isAdmin) 
//     VALUES ('john.doe@example.com', 'hashedpassword', 1)
// `);

// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS one_time_links (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         token TEXT,
//         username TEXT,
//         isUsed INTEGER DEFAULT 0 CHECK (isUsed IN (0,1)),  -- Using INTEGER to represent boolean with constraint,
//         expiry INTEGER
// )`);
// });

// db.serialize(() => {
//     db.run(`ALTER TABLE users ADD COLUMN isLocked DEFAULT 0 CHECK (isLocked IN (0,1))`);
// });

// db.serialize(() => {
//     db.run(`ALTER TABLE users ADD COLUMN maxAttempts DEFAULT 0 INTEGER CHECK (maxAttempts < 4)`);
// });

// db.serialize(() => {
//     db.run(`DROP TABLE IF EXISTS one_time_links`);
// });

// db.serialize(() => {
//     db.run(`UPDATE users SET isAdmin = 1 where id=10`);
// });

// db.serialize(() => {
//     db.get(`SELECT isLocked FROM users WHERE id = ?`, [11], (err, result) => {
//         if(err) {
//             console.error(err);
//         } else {
//             console.log(result.isLocked);
//         }
//     });
// });
