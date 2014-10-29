describe('The Endpoint Model', function () {

    describe('when we get the endpoint', function () {
        it('should call the getEndpoint method on the client and pass in the options', function (done) {

            App.models.endpoint({
                name: 'client-name',
                client: {
                    getEndpoint: function (options) {
                        assert.equal(options.name, 'client-name');
                        done();
                    }
                }
            });

        });
    });

});