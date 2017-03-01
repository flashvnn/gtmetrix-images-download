// ===================================================
// IMPORTANT: only for production
// total.js - web application framework for node.js
// http://www.totaljs.com
// ===================================================
var env = process.env;
//var fs = require('fs');
var options = {};

options.ip = env.NODE_IP || 'localhost';
options.port = env.NODE_PORT || 3000;
// options.config = { name: 'total.js' };
// options.https = { key: fs.readFileSync('keys/agent2-key.pem'), cert: fs.readFileSync('keys/agent2-cert.pem')};
// options.sleep = 2000;

require('total.js').http('release', options);
// require('total.js').https('release', options);
