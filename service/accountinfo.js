const nem = require('nem-sdk').default;

const endpoint = nem.model.objects.create('endpoint')(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
);

module.exports = {
    getTxHistory: function() {
        nem.com.requests.account.transactions.all(endpoint, process.env.TEST_ADDRESS).then(function(result) {
            let data = [];
        
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
            return data;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
}