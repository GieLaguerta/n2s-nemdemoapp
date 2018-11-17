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

/* login */
router.get('/login', (req, res) => {
    res.render('index.pug');
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
    console.log(nem.com.requests.account.data(endpoint, process.env.TEST_ADDRESS));
});

router.get('/account/loan', (req, res) => {
    res.render('loan.pug');
});

router.get('/account/dashboard', (req, res) => {
    let data = [];
    let sampleData = [];

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
            sampleData.push({acc_tx:
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
        //const amount = nem.utils.format.nemValue(result.data[0].transaction.amount);
        //const fmt = amount[0] + "." + amount[1];
        //console.log(fmt);
        res.render('dashboard.pug', {
            data
        });
        //console.log(sampleData);
    }, function(err) {
        console.log(err);
    });

    nem.com.requests.account.data(endpoint, process.env.TEST_ADDRESS).then(function(result) {
        return sampleData.push({acc_data: result});
    }, function(err) {
        console.log(err);
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

/*  todo create nano wallet <- private key <- address <- send to main wallet <- saved hash, address, privatekey to database */
router.get('/register', (req, res) => {
    res.render('registration.pug');
});

router.post('/register', (req, res) => {
    // Saved to database privatekey, address, transaction hash
    const rBytes = nem.crypto.nacl.randomBytes(32); // random bytes from PRNG
    const privateKey = nem.utils.convert.ua2hex(rBytes); // convert random bytes to hex
    const keyPair = nem.crypto.keyPair.create(privateKey);
    const publicKey = keyPair.publicKey.toString(); // to save to database
    const address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id);
    
    // Send to user
    const accountData = {
        name: req.body.name,
        lastname: req.body.las,
        contact: req.body.contact,
        wallet_address: address
    };

    const transferTransaction = nem.model.objects.create('transferTransaction')(
        address,
        0,
        JSON.stringify(accountData)
    );

    const transactionEntity = nem.model.transactions.prepare('transferTransaction')(
        common,
        transferTransaction,
        nem.model.network.data.testnet.id
    );

    nem.model.transactions.send(common, transactionEntity, endpoint).then(function(result) {
        res.send(result.transactionHash.data);
        //res.render('index.pug');
    }, function(err) {
        console.log(err);
    });
});

module.exports = router;


// my assets / ballance
// transfer money to remittance
// qr code to present to remittance center ADDRESS
// cash in 

// create an account
// - Fill up form, generate wallet address, send generated address from platform to newly created wallet
// - save address, privatekey, hash of the generated wallet transaction to the database