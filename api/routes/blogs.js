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
    let { page } = req.query
    console.log(req.query)

    page = parseInt(page) || 1;
    const pageSize = 8;
    const offset = (page - 1) * pageSize;

    try {
        let totalItems;

        const countData = await pool.query(`SELECT COUNT(*)
            FROM blogs`);
        totalItems = countData.rows[0].count;

        const data = await pool.query(`SELECT * FROM blogs
        LIMIT ${pageSize}
        OFFSET ${offset}`)
        const blogs = data.rows

        if (blogs.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json({blogs, totalItems});

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

router.get('/searchBlogs', async (req, res, next) => {
    let { searchTerm, page, pageSize } = req.query

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;
    
    try {
        let totalItems;

        const countData = await pool.query(`SELECT COUNT(*)
            FROM blogs
            WHERE title ILIKE $1`,
            [`%${searchTerm}%`]);
        totalItems = countData.rows[0].count;

        const data = await pool.query(`SELECT *
            FROM blogs
            WHERE title ILIKE $1
            LIMIT ${pageSize}
            OFFSET ${offset}`,
            [`%${searchTerm}%`])

        const blogs = data.rows

        if (blogs.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json({blogs, totalItems});
    } catch (error) {
        next(error);
    }
})

router.get('/filteredBlogs', async (req, res, next) => {
    let {type, page, pageSize} = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;

    try {
        let totalItems;

        const countData = await pool.query(`SELECT COUNT(*)
            FROM blogs
            WHERE $1 ILIKE ANY(place_tag)`,
            [type]);
        totalItems = countData.rows[0].count;

        const data = await pool.query(`SELECT *
            FROM blogs
            WHERE $1 ILIKE ANY(place_tag)
            LIMIT ${pageSize}
            OFFSET ${offset}`,
            [type])
        const blogs = data.rows

        if (blogs.length === 0) {
            return next(errorHandler(404, 'No blogs found'));
        }

        res.status(200).json({blogs, totalItems});
    } catch {
        next(error);
    }
})


export default router;