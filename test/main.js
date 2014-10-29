define(function (require) {

    var chai = require('/vendor/chai/chai.js'),
        specs = require('./specs');

    window.assert = chai.assert;

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }

});