describe('The Status Types Model', function () {

    describe('when we get array of status types', function () {
        it('should return an array', function () {
            var statusTypes = App.models.statusTypes();
            assert.equal(typeof statusTypes, 'object');
        });
    });

});