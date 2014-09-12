describe('The Endpoint Messaging View', function () {

    beforeEach(function () {
        this.view = messagingView({
            username: 'bob',
            connectTo: 'alice'
        });
    });

    describe('when the client is connected', function () {
        it('should set the client on the view', function (done) {
            var endpoint = App.models.endpoint;
            App.models.endpoint = function (obj) {
                assert.equal(obj.client.myString, 'hi');
                done();
            };
            this.view.onConnection({
                myString: 'hi'
            });
            App.models.endpoint = endpoint;
        });
    });

    describe('when we send a message', function () {
        it('should send the message to the model', function (done) {
            var endpoint = App.models.endpoint;
            App.models.endpoint = function (obj) {
                return {
                    sendMessage: function (data) {
                        assert.equal(data.message, 'test message');
                        done();
                    }
                }
            };
            this.view.renderMessage = sinon.stub();
            this.view.onConnection({
                myString: 'hi'
            });
            this.view.sendMessage('test message');
        });
    });

});