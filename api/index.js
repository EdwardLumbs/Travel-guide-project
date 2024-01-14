import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './database/db.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get('/test', async (req, res) => {
    try {
        const results = await pool.query("SELECT * FROM users WHERE email = $1",
        ["edwardlumbao@yahoo.com"])
        res.json(results.rows)
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
})

// error handling middleware

app.use((err, req, res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})