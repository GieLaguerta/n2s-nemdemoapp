const nem = require('nem-sdk').default;

const endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.account.data(endpoint, 'TDF6DIKVZTR5F632VMCIGAUY6L4F3B5IVWJQF5DD').then( function(res) {
    console.log(res);
}, function(err) {
    console.error(err);
});