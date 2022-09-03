const Pool = require("pg").Pool;
const pool = new Pool({
  user: "daniel",
  host: "localhost",
  database: "chatblog_db",
  password: "root",
  port: 5432,
});

const getPosts = (request, response) => {
  pool.query("SELECT * FROM posts ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getPostById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM posts WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createPost = (request, response) => {
  const { id, title, content, image } = request.body;

  pool.query(
    "INSERT INTO posts (id, title, content, image) VALUES ($1, $2, $3, $4) RETURNING *",
    [id, title, content, image],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Post added with ID: ${results.rows[0].id}`);
    }
  );
};

const deletePost = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM posts WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Post deleted with ID: ${id}`);
  });
};

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { id, username, firstname, lastname, email, password } = request.body;

  pool.query(
    "INSERT INTO users (id, username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [id, username, firstname, lastname, email, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  getUsers,
  getUserById,
  createUser,
  deleteUser,
};
