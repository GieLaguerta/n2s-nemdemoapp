const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;

require('dotenv').config();

const endpoint = nem.model.objects.create('endpoint')(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
);

const common = nem.model.objects.create('common')(
    'Asdqwe123',
    process.env.TEST_PRIVATE_KEY_N2S
);

const address1 = process.env.TEST_ADDRESS_N2S;
const address2 = process.env.TEST_ADDRESS;

router.get('/account', (req, res) => {
    nem.com.requests.account.transactions.all(endpoint, address1).then(function(result) {
        res.json(result);
    }, function(err) {
         console.log(err);
    });
});

router.get('/apply', (req, res) => {
     res.redirect('/');
});

router.post('/apply', (req, res, next) => {
    const transferTransaction = nem.model.objects.create(
        'transferTransaction')(
            address2,
            1,
            'Pa apply'
    );

    const transactionEntity = nem.model.transactions.prepare(
        'transferTransaction')(
            common,
            transferTransaction,
            nem.model.network.data.testnet.id
    );

    nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {
        console.log(res);
    }, function(err) {
        console.log(err);
    })
});

module.exports = router;