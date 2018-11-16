const express = require('express');
const nem = require('nem-sdk').default;

const endpoint = nem.model.objects.create('endpoint')(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
);

const common = nem.model.objects.create('common')(
    process.env.WALLET_PASS,
    process.env.TEST_PRIVATE_KEY
);

router.post('/register', (req, res) => {
    const name ='name';
    const lastname = 'lastname';
    const gender = 'male';
    const password = 'password';

    const data = {
        name: 'oliver',
        lastname: 'escosura',
        gender: 'male',
    }

    const transferTransaction = nem.model.objects.create('transferTransaction')(
        'TDG4ELTTDM4PZWF5P7BKRXFUEEGM3VEUEZ765EI5',
        0,
        data
    );

    const transactionEntity = nem.model.transactions.prepare('transferTransaction')(
        common,
        transferTransaction,
        nem.model.network.data.testnet.id
    );

    nem.model.transactions.send(common, transactionEntity, endpoint).then(function(result) {
          res.json(result);
    }, function(err) {
        console.log(err);
    });
});