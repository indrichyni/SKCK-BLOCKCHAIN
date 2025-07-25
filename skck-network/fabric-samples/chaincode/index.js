//'use strict';

//const shim = require('fabric-shim');
//const SKCKContract = require('./lib/SKCKContract');

//shim.start(new SKCKContract());

//'use strict';

//const { Contract } = require('fabric-contract-api'); fabric-contract-api
//const SKCKContract = require('./lib/SKCKContract');

//module.exports.contracts = [ SKCKContract ];
//module.exports.SKCKContract = SKCKContract;

'use strict';

const SKCKContract = require('./lib/SKCKContract');

module.exports.contracts = [ SKCKContract ];
