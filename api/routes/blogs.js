import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
import { v4 } from "uuid";
dotenv.config();

const router = express.Router();

router.post('/createPost', verifyToken, async (req, res, next) => {
    const { user_id, title, place_tag, photo, content } = req.body

    try {
        await pool.query("INSERT INTO blogs (user_id, title, place_tag, photo, content) VALUES ($1, $2, $3, $4, $5)",
            [user_id, title, place_tag, photo, content])
            res.status(201).json("Blog Posted Successfully");

    } catch (error) {
        next(error);
    }
})

router.get('/getBlogs', async (req, res, next) => {
    try {
        const data = await pool.query("SELECT * FROM blogs")

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    }
})

router.get('/getBlog/:blogId', async (req, res, next) => {
    const { blogId } = req.params
    try {
        const data = await pool.query("SELECT * FROM blogs WHERE id = $1",
        [blogId])

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    }
})

router.get('/searchBlogs/:title', async (req, res, next) => {
    const { title } = req.params
    try {
        const data = await pool.query(`SELECT *
        FROM blogs
        WHERE title ILIKE $1`,
        [`%${title}%`])

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    }
})

router.get('/filteredBlogs', async (req, res, next) => {
    let {type, page} = req.query;

    // page = parseInt(page) || 1;
    // pageSize = parseInt(pageSize) || 8;
    // const offset = (page - 1) * pageSize;

    try {
        let totalItems

        const data = await pool.query(`SELECT *
            FROM blogs
            WHERE $1 ILIKE ANY(place_tag)`,
            [type])
        const blogs = data.rows

        res.status(200).json(blogs);
    } catch {
        next(error);
    }
})


export default router;