/*jslint node: true */

var express = require('express'),
    app = express();

app.use(express['static'](__dirname.replace('server', 'app')));
app.use(express['static'](__dirname.replace('server', '')));

module.exports = app;
