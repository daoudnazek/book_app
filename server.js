'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const { response, request } = require('express');

const app = express();

app.use(cors());
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3500;

app.get('/hello', (req,res) =>{
    res.render('pages/index');
})

app.listen(PORT, ()=>{
    console.log(`Listening to Port ${PORT}`);
  });