const Pool = require('pg').Pool
const pool = new Pool({
  user: 'daniel',
  host: 'localhost',
  database: 'practice_db',
  password: 'root',
  port: 5432,
})

const getPosts = (request, response) => {
    pool.query('SELECT * FROM posts ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getPostById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM posts WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createPost = (request, response) => {
    const {id, title, content} = request.body

    pool.query('INSERT INTO posts (id, title, content) VALUES ($1, $2, $3) RETURNING *', [id, title, content], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Post added with ID: ${results.rows[0].id}`)
    })
}

const deletePost = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM posts WHERE id = $1', [id], (error, results) => {
        if (error){
            throw error
        }
        response.status(200).send(`Post deleted with ID: ${id}`)
    })
}

module.exports = {
    getPosts,
    getPostById,
    createPost,
    deletePost
}