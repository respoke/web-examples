describe('The Base Model', function () {

    beforeEach(function () {
        var Person = $.Model.extend({
            myCustomMethod: function () {}
        });
        this.person = new Person({
            firstName: 'Darth',
            lastName: 'Vader'
        });
    });

    describe('when we get the value of the model', function () {
        it('should allow custom methods', function () {
            assert.equal(typeof this.person.myCustomMethod, 'function');
        });
        it('should set the value based on the object passed into it', function () {
            assert.equal(this.person.get().firstName, 'Darth');
            assert.equal(this.person.get().lastName, 'Vader');
        });
        it('should update the value correctly', function () {
            this.person.set({
                lastName: 'Maul'
            });
            assert.equal(this.person.get().firstName, 'Darth');
            assert.equal(this.person.get().lastName, 'Maul');
        });
    });

});