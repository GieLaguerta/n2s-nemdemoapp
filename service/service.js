const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;

require('dotenv').config();

const endpoint = nem.model.objects.create('endpoint')(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
);

const common = nem.model.objects.create('common')(
    process.env.WALLET_PASS,
    process.env.TEST_PRIVATE_KEY
);

router.get('/account', (req, res) => {
    nem.com.requests.account.data(endpoint, process.env.TEST_ADDRESS).then(function(result) {
        console.log(result);
        res.json({
            acc_address: result.account.address,
            balance: result.account.balance,
            vested_balance: result.account.vestedBalance
        });
    }, function(err) {
         console.log(err);
    });
});

router.get('/transaction', (req, res) => { // todo: amount, types of asset
    nem.com.requests.account.transactions.incoming(endpoint, process.env.TEST_ADDRESS).then(function(result) {
        console.log(result.data[0].transaction.recipient);
          res.json(
              result
          );

        for (let i = 0; i < result.data.length; i++) {
            const element = result.data[i].transaction.recipient; // transaction recipient
            console.log(element);
        }

        for (let i = 0; i < result.data.length; i++) {
            const element = result.data[i].transaction.timeStamp; // transaction timestamp
            let dts = nem.utils.format.nemDate(element);
            console.log(dts);
            }

        for (let i = 0; i < result.data.length; i++) {
            const element = result.data[i].transaction.message; // transaction message
            let fmt = nem.utils.format.hexMessage(element);
            console.log(fmt);
        }

    }, function(err) {
        console.log(err);
    });
});

//Todo: Invoice for payment due; 

//Todo: Apply loan confrmation depends the value of the collateral

router.post('/transfer', (req, res, next) => {
    const transferTransaction = nem.model.objects.create(
        'transferTransaction')(
            req.body.address,
            req.body.amount,
            req.body.message
    );

    const transactionEntity = nem.model.transactions.prepare(
        'transferTransaction')(
            common,
            transferTransaction,
            nem.model.network.data.testnet.id
    );

    nem.model.transactions.send(common, transactionEntity, endpoint).then(function(result) {
        //console.log(res);
         res.render('index.pug');
    }, function(err) {
        console.log(err);
    });
});

router.get('/success', (req, res) => {
    res.send('token transfer ok!');
});

module.exports = router;