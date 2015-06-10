'use strict';

var app = require('./app.js'),
    conf = require('config');

app.listen(conf.server.port);
console.log('Server started at port ' + conf.server.port);
