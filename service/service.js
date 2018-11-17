const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;
const User = require('../model/userModel');

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
//router.get('/login', (req, res) => {
//    res.render('index.pug');
//});

router.post('/login', (req, res) => {
    let data = [];
    let dataTx = [];

    User.findOne({ username: req.body.username, password: req.body.password}, function(err, user) {        
        const userWalletAddress = user.get('wallet_address');
        const username = user.get('username');
        const hash = user.get('txHash')
        //console.log(userWalletAddress);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        // fetch all transactions of account
        nem.com.requests.account.transactions.all(endpoint, userWalletAddress).then(function(result) {
            //const message = result.data[0].transaction.message.payload;

            data.push({
                username,
                userWalletAddress
            });

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
            console.log(data);
            // fetch account's balance
            nem.com.requests.account.data(endpoint, userWalletAddress).then(function(result) {
                const accountBalance = result.account.balance;
                dataTx.push({
                    accountBalance
                });
                // fetch user info by hash
                const searchEnabledEndpoint = nem.model.objects.create('endpoint')(nem.model.nodes.searchOnTestnet[0].uri, nem.model.nodes.defaultPort);
                nem.com.requests.transaction.byHash(searchEnabledEndpoint, hash).then(function(result) {
                    console.log(result.transaction.message.payload);
                    const hashData = result.transaction.message.payload; // to decrypt for users id send to dashboard
                    res.render('dashboard.pug', { data: data, dataTx: dataTx });
                });
            });
        });
    });
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
    let data = [];
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
        data.push({
            walletAddress: address,
            publicKey: publicKey,
            privateKey: privateKey,
            txHash: result.transactionHash.data,
        });
        res.json(data);

        // save user, password, wallet address, publikey, privatekey, hash of the digital identity
        const user = new User({
            username: 'mrgxsy',
            password: 'asdqwe123',
            wallet_address: data[0].walletAddress,
            publicKey: data[0].publicKey,
            privateKey: data[0].privateKey,
            txHash: data[0].txHash
        });
        user.save(function(err) {
            if(err) console.log(err);
            console.log('user registration success');
        });

        User.find({}, function(err, result) {
            console.log(result);
        });
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