const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

const setUpRoutes = () => {
    app.use(express.json());

    const allowedOrigins = [
        "http://127.0.0.1:5173"
    ];

    app.use(cors({
        credentials: true,
        origin: allowedOrigins,
    }));

    app.use(cookieParser());

    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/home", homeRoutes);
    // // verify token / authentication 
    // app.use(authenticateUser);

    // // error handling should be last
    app.use(errorHandlerMiddleware);

};

const PORT = process.env.PORT || 8800;

const start = () => {
    setUpRoutes();
    db.clearExpiredTokenLinks();
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    })
};

start();

