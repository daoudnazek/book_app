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


app.get('/', (req, res) => {
    res.render('pages/index')
})

app.post('/searches', (req, res) => {
    let searchText = req.body.searchText;
    let searchType = req.body.searchType;

    if(searchType === 'title') {
       var url = `https://www.googleapis.com/books/v1/volumes?q=intitle${searchText}`;
      } else if (searchType === 'author') {
       var url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchText}`;
      }

    superagent.get(url).then(data => {
        // console.log(data.body.items)
            let booksResult = data.body.items.map(e =>  new Book(e));
            res.render('pages/searches/show', { books: booksResult });
        });
})

app.all('*', (request, response) => {
    response.status(500).send('this page doesn`t exist !!');
})

app.listen(PORT, () => {
    console.log(`Listening to Port ${PORT}`);
});


function Book(data) {
    console.log(data);
    this.title = data.volumeInfo.title || 'Title Missing';
    this.author = data.volumeInfo.authors || 'Author Unknown';
    this.image_url = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpeg';
    this.description = data.volumeInfo.description || 'Description Missing';
}