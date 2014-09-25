'use strict';
describe('The Client Model', function () {

    before(function (done) {
        var self = this;
        App.models.client('darth-vader', function (client) {
            self.client = client;
            done();
        });
    });

    describe('when we connect to a client', function () {
        it('should make a connection', function () {
            assert.equal(this.client.endpointId, 'darth-vader');
        });
    });

});