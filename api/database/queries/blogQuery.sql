CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    place_tag text[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo TEXT NOT NULL,
    content TEXT NOT NULL
)

-- create blogs
INSERT INTO blogs (user_id, title, place_tag, photo, content) 
VALUES (user_id, title, place_tag, photo, content)

-- get blogs
SELECT *
ORDER BY created_at DESC
FROM blogs
LIMIT pageSize
OFFSET offset

-- get newly created blog
SELECT * FROM blogs 
WHERE user_id = $1 
AND title = $2 
AND place_tag = $3 
AND photo = $4 
AND content = $5

-- get blogs with 2 tags
SELECT *
FROM blogs
WHERE tag1 ILIKE ANY(place_tag)
  AND tag2 ILIKE ANY(place_tag)
ORDER BY created_at DESC
LIMIT 4;

-- get blogs with 1 tag
SELECT *
FROM blogs
WHERE tag1 ILIKE ANY(place_tag)
ORDER BY created_at DESC
LIMIT 4;

-- delete blog
DELETE FROM blogs
WHERE condition

-- get Blog
SELECT *
FROM blogs
WHERE id = id

-- get user Blog
SELECT *
FROM blogs
WHERE user_id = userid

-- get Searched Blogs
SELECT *
FROM blogs
WHERE title ILIKE '%title%'
LIMIT pageSize
OFFSET offset

-- get filtered tags
SELECT *
FROM blogs
WHERE tag ILIKE ANY(place_tag)
LIMIT limit
OFFSET offset

-- get blogs count
SELECT COUNT(*) FROM blogs

-- get filtered blog count
SELECT COUNT(*)
FROM blogs
WHERE tag ILIKE ANY(place_tag)

-- get searched blogs count
SELECT COUNT(*)
FROM blogs
WHERE title ILIKE '%title%'
