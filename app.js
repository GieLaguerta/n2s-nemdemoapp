const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const userService = require('./service/service');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/n2sdb' || 'mongodb://localhost:27017/n2sdb', { useNewUrlParser: true });

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/service', userService);
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index.pug');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connetion error'));
db.once('open', function() {
    console.log('connected successfully to the server');
  });

app.listen(process.env.PORT || 3000, function(err) {
    if (err) throw err;
});

module.exports = app;