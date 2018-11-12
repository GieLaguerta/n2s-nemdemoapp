const nem = require('nem-sdk').default;

const endpoint = nem.model.objects.create('endpoint')(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
);

const common = nem.model.objects.create('common')(
    'Asdqwe123',
    '5cca8a129762e5e69a2abcc6324ecfaf1581344a57787b576f3a2ffc24040960'
);

const tx = {
    moneyTransfer: function(address, amount, message) {
        const transferTransaction = nem.model.objects.create('transferTransaction')(
            address,
            amount,
            ''
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
        });
    }
}

module.exports = tx;