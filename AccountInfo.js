"use strict";
exports.__esModule = true;
var nem_library_1 = require("nem-library");
nem_library_1.NEMLibrary.bootstrap(nem_library_1.NetworkTypes.TEST_NET);
var address = new nem_library_1.Address('TDF6DIKVZTR5F632VMCIGAUY6L4F3B5IVWJQF5DD');
var accountHttp = new nem_library_1.AccountHttp();
var pageable = accountHttp.allTransactionsPaginated(address);
pageable.subscribe(function (transactions) {
    console.log(transactions);
});
pageable.nextPage().then(function(result) {
});
