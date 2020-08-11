'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const { response, request } = require('express');

const app = express();

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3500;

const client = new pg.Client(process.env.DATABASE_URL);

app.get('/', (req, res) => {
    let SQL = 'SELECT * FROM books';
    return client.query(SQL).then(result => {
        if (result.rowCount === 0) {
            res.render('pages/searches/new')
        } else {
            res.render('pages/index', { books: result.rows });
        }
    })
})


app.post('/searches', (req, res) => {
    let searchText = req.body.searchText;
    let searchType = req.body.searchType;
    if (searchType === 'title') {
        var url = `https://www.googleapis.com/books/v1/volumes?q=intitle${searchText}`;
    } else if (searchType === 'author') {
        var url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchText}`;
    }
    superagent.get(url).then(data => {
        // console.log(data.body.items)
        let booksResult = data.body.items.map(e => new Book(e));
        res.render('pages/searches/show', { books: booksResult });
    });
})

app.get('/books/:id', (req, res) => {
    let SQL = 'SELECT * FROM books where id=$1';
    let values = [req.params.id];
    return client.query(SQL, values).then(result => {
            res.render('pages/books/show', { book: result.rows[0] }
            )
        })
})

app.all('*', (request, response) => {
    response.status(500).send('this page doesn`t exist !!');
})
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening to Port ${PORT}`);
    });
});

function Book(data) {
    this.title = data.volumeInfo.title || 'Title Missing';
    this.author = data.volumeInfo.authors || 'Author Unknown';
    this.image_url = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpeg';
    this.isbn = book.volumeInfo.industryIdentifiers[0].type + book.volumeInfo.industryIdentifiers[0].identifier || 'isbn Missing';
    this.description = data.volumeInfo.description || 'Description Missing';
}