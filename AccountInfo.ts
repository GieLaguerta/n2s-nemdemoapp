import { AccountHttp, Address, NEMLibrary, NetworkTypes, Account } from 'nem-library';

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

let address = new Address('TDF6DIKVZTR5F632VMCIGAUY6L4F3B5IVWJQF5DD');
let accountHttp = new AccountHttp();

let pageable = accountHttp.allTransactionsPaginated(address);

pageable.subscribe(transactions => {
    console.log(transactions);
});

pageable.nextPage();