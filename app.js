const express = require('express');
const transfer = require('./src/transfer');

const app = express();

app.listen(3000, () => console.log('server running on port 3000'));

app.use('/transfer/:address/:amount', (req, res, next) => {
    const address = req.params.address;
    const amount = req.params.amount;

    transfer.moneyTransfer(address, amount);
});