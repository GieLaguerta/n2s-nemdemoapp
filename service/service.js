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

router.get('/dashboard', (req, res) => {
    res.render('dashboard.pug');
});

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

router.get('/account/dashboard', (req, res) => { // todo: amount, types of asset
    nem.com.requests.account.transactions.all(endpoint, process.env.TEST_ADDRESS).then(function(result) {
        let data = [];
        console.log(result.data[0]);

        for (let i = 0; i < result.data.length; i++) {
            const recipient = result.data[i].transaction.recipient; // transaction recipient
            const timeStamp = nem.utils.format.nemDate(result.data[i].transaction.timeStamp); // timestamp
            const message = nem.utils.format.hexMessage(result.data[i].transaction.message); // message
            const txType = nem.utils.format.txTypeToName(result.data[i].transaction.type); // transaction type
            const amount = nem.utils.format.nemValue(result.data[i].transaction.amount); // amount
            //const fmt = fmt[0] + "." + fmt[1];
            data.push({
                recipient,
                timeStamp,
                message,
                txType,
                amount
            });
        }
        const amount = nem.utils.format.nemValue(result.data[0].transaction.amount);
        const fmt = amount[0] + "." + amount[1];
        console.log(fmt);
        res.render('dashboard.pug', {data: data});
    })
    .catch(function(err) {
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

module.exports = router;