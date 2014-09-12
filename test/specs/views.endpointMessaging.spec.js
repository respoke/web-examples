describe('The Endpoint Messaging View', function () {

    beforeEach(function () {
        this.view = messagingView({
            username: 'bob',
            connectTo: 'alice'
        });
    });

    /*describe('when we connect to a client', function () {
        it('should make a connection', function () {
            var messageSent = sinon.spy();
            sinon.stub(App.models, 'endpoint', function () {
                return {
                    sendMessage: messageSent
                }
            });
            sinon.spy(this.view, 'sendMessage');
            this.view.createConnection();
            App.models.endpoint.restore();
        });
    });*/

});