const express = require('express');
const bodyParser = require('body-parser');
const transfer = require('./src/transfer');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`server running on ${port}`);
});

app.post('/transfer', (req, res, next) => {
    const address = req.body.address;
    const amount = req.body.amount;

    transfer.moneyTransfer(address, amount);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello');
});