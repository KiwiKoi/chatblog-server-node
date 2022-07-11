const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");

const db = require('./queries')
const port = 4000

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, Postgres API'})
})
app.set('port', process.env.PORT || port);
app.get('/posts', db.getPosts);
app.get('/posts/:id', db.getPostById);
app.post('/posts', db.createPost);
app.delete('/posts/:id', db.deletePost);

app.listen(4000, function () {
    console.log(`Server is running port ${port}`);
});