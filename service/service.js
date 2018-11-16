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
    console.log(nem.com.requests.account.data(endpoint, process.env.TEST_ADDRESS));
});

router.get('/account/loan', (req, res) => {
    res.render('loan.pug');
});

router.get('/account/dashboard', (req, res) => {
    let data = [];
    let dataMosaic = [];
    let accInfo = [];

    nem.com.requests.account.transactions.all(endpoint, process.env.TEST_ADDRESS).then(function(result) {
        

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

        /*nem.com.requests.account.mosaics.owned(endpoint, process.env.TEST_ADDRESS).then(function(result) {
            for (let i = 0; i < result.data.length; i++) {
                dataMosaic.push(result.data[i]);
            }
            console.log(dataMosaic);
        });*/

        nem.com.requests.account.data(endpoint, process.env.TEST_ADDRESS).then(function(result) {
            accInfo.push(result.account.balance);
        });

        //const amount = nem.utils.format.nemValue(result.data[0].transaction.amount);
        //const fmt = amount[0] + "." + amount[1];
        //console.log(fmt);
        res.render('dashboard.pug', {
            data
        });
    });
});

function getAsset(){
    nem.com.requests.account.data(endpoint, process.env.TEST_ADDRESS).then(function(result) {
        return result.account.balance;
    });
}


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


router.get('/register', (req, res) => {
    res.send('/');
});

router.post('/register', (req, res) => {
    const accountData = {
        name: 'oliver',
        lastname: 'escosura',
        gender: 'male',
    }

    const transferTransaction = nem.model.objects.create('transferTransaction')(
        'TDG4ELTTDM4PZWF5P7BKRXFUEEGM3VEUEZ765EI5',
        0,
        accountData
    );

    const transactionEntity = nem.model.transactions.prepare('transferTransaction')(
        common,
        transferTransaction,
        nem.model.network.data.testnet.id
    );

    nem.model.transactions.send(common, transactionEntity, endpoint).then(function(result) {
          res.send(result);
          //res.render('index.pug');
    }, function(err) {
        console.log(err);
    });
});


// search account by hash
const txHash = '2d1ed876eb12f1f9177c14277c26b6a27cfce991f6410e8341459c69e1728788';
const searchEnabledEndpoint = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnTestnet[0].uri, nem.model.nodes.defaultPort);
nem.com.requests.transaction.byHash(searchEnabledEndpoint, txHash).then(function(res) {
	console.log("\nTransaction data:");
    console.log(res.transaction.message.payload);
    
    //return decrypt message as hex
    console.log(nem.crypto.helpers.decode('0bd87d8bebb48799aac5634d19fe7715a47100a386aa22d4ce54fd004eb069ae', '57f91da1bba7c499bb990dc7bd08608d44a9e5a2c10f3fc6d7bc36e7b226b65b', res.transaction.message.payload));
    
   // console.log(userData);
}, function(err) {
	console.error(err);
});



/*  todo create nano wallet <- private key <- address <- send to main wallet <- saved hash, address, privatekey to database */




module.exports = router;


// my assets / ballance
// transfer money to remittance
// qr code to present to remittance center ADDRESS
// cash in 

// create an account
// - Fill up form, generate wallet address, send generated address from platform to newly created wallet
// - save address, privatekey, hash of the generated wallet transaction to the database