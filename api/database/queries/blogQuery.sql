CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    place_tag text[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo TEXT NOT NULL,
    content TEXT NOT NULL
)

-- get blogs
SELECT *
FROM blogs

-- get Blog
SELECT *
FROM blogs
WHERE id = id