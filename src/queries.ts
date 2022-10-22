import {jwt} from "./app";
const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const pool = new Pool({
  user: "daniel",
  host: "localhost",
  database: "chatblog_db",
  password: "root",
  port: 5432,
});

// const getPosts = (request: any, response: any) => {
//   pool.query("SELECT * FROM Post ORDER BY id ASC", (error: any, results: any) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const getPostById = (request: any, response: any) => {
//   const id = parseInt(request.params.id);
//   pool.query("SELECT * FROM Post WHERE id = $1", [id], (error: any, results: any) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows[0]);
//   });
// };

// const createPost = (request: any, response: any) => {
//   const { id, title, content, image } = request.body;

//   pool.query(
//     "INSERT INTO post (id, title, content, image) VALUES ($1, $2, $3, $4) RETURNING *",
//     [id, title, content, image],
//     (error: any, results: any) => {
//       if (error) {
//         throw error;
//       }
//       response.status(201).json(`${results.rows[0].id}`);
//     }
//   );
// };

// const deletePost = (request: any, response: any) => {
//   const id = parseInt(request.params.id);

//   pool.query("DELETE FROM Post WHERE id = $1", [id], (error: any, results: any) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).send(`Post deleted with ID: ${id}`);
//   });
// };

// const getUsers = (request: any, response: any) => {
//   pool.query("SELECT * FROM user ORDER BY id ASC", (error: any, results: any) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const getUserById = (request: any, response: any) => {
//   const id = parseInt(request.params.id);
//   pool.query("SELECT * FROM user WHERE id = $1", [id], (error: any, results: any) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const createUser = (request: any, response: any) => {
//   const { id, username, firstname, lastname, email, password } = request.body;

//   bcrypt.hash(password, saltRounds, (error: any, hash: any) => {
//     if (error) {
//       console.log(error);
//     }
//     pool.query(
//       "INSERT INTO user (id, username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
//       [id, username, firstname, lastname, email, hash],
//       (error: any, results: any) => {
//         if (error) {
//           throw error;
//         }
//         response.status(201).send(`User added with ID: ${results.rows[0].id}`);
//       }
//     );
//   });
// };

// const deleteUser = (request: any, response: any) => {
//   const id = parseInt(request.params.id);
//   pool.query("DELETE FROM user WHERE id = $1", [id], (error: any, results: any) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).send(`User deleted with ID: ${id}`);
//   });
// };

// const getComments = (request: any, response: any) => {
//   pool.query(
//     "SELECT * FROM comment ORDER BY createdAt ASC",
//     (error: any, results: any) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).json(results.rows);
//     }
//   );
// };

// const getCommentById = (request: any, response: any) => {
//   const commentID = parseInt(request.params.commentID);
//   pool.query(
//     "SELECT * FROM comment WHERE commentID = $1",
//     [commentID],
//     (error: any, results: any) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).json(results.rows);
//     }
//   );
// };

// const createComment = (request: any, response: any) => {
//   const { commentID, content, createdAt, updatedAt, user, post } = request.body;

//   pool.query(
//     "INSERT INTO comment (commentID, content, createdAt, updatedAt, user, post) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
//     [commentID, content, createdAt, updatedAt, user, post],
//     (error: any, results: any) => {
//       if (error) {
//         throw error;
//       }
//       response
//         .status(201)
//         .send(`comment added with commentID: ${results.rows[0].commentID}`);
//     }
//   );
// };

// const deleteComment = (request: any, response: any) => {
//   const commentID = parseInt(request.params.commentID);

//   pool.query(
//     "DELETE FROM comment WHERE id = $1",
//     [commentID],
//     (error: any, results: any) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).send(`comment deleted with commentID: ${commentID}`);
//     }
//   );
// };

const login = (request: any, response: any) => {
  const username = request.body.username;
  const password = request.body.password;

  pool.query(
    `SELECT * FROM user WHERE username = $1`,
    [username],
    (error: any, results: any) => {
      if (error) {
        throw error;
      }

      if (results.rows.length > 0) {
        bcrypt.compare(password, results.rows[0].password, (error: any, res: any) => {
          if (res) {
            const id = results.rows[0].id;
            const token = jwt.sign({ id }, "jwtSecret", { expiresIn: 300 });

            request.session.user = results.rows[0];

            response.json({
              auth: true,
              token: token,
              results: results.rows[0].id,
            });
          } else {
            return response.json({
              auth: false,
              message: "Wrong username or password.",
            });
          }
        });
      } else {
        return response.json({
          auth: false,
          message: "User doesn't exist.",
        });
      }
    }
  );
};

module.exports = {
 // getPosts,
 // getPostById,
 // createPost,
  // deletePost,
  // getUsers,
  // getUserById,
  // createUser,
  // deleteUser,
  // getComments,
  // getCommentById,
  // createComment,
  // deleteComment,
  login};
