const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const userRouter = require('./service/service');;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/service', userRouter);
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index.pug');
});

app.listen(process.env.PORT || 3000, function(err) {
    if (err) throw err;
});

module.exports = app;