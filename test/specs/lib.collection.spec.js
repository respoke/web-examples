describe('The Base Collection', function () {

    var Person = $.Model.extend({});
    var People = $.Collection.extend({
        model: Person,
        myCustomMethod: function () {}
    });

    beforeEach(function () {
        this.people = new People([{
            firstName: 'Han',
            lastName: 'Solo'
        }, {
            firstName: 'Luke',
            lastName: 'Skywalker'
        }]);
    });

    describe('when we create a new collection', function () {
        it('should allow custom methods', function () {
            assert.equal(typeof this.people.myCustomMethod, 'function');
        });
        it('should add the initial values to the collection', function () {
            assert.equal(this.people.length(), 2);
        });
    });

    describe('when we convert the collection to JSON', function () {
        it('should return valid JSON values', function () {
            var json = this.people.toJSON();
            assert.equal(json[0].firstName, 'Han');
            assert.equal(json[1].firstName, 'Luke');
        });
    });

    describe('when we remove an item from the collection', function () {
        it('should remove it as expected', function () {
            assert.equal(this.people.length(), 2);
            this.people.remove(0);
            assert.equal(this.people.length(), 1);
        });
    });

    describe('when we find a single record', function () {
        it('should return the correct model', function () {
            var person = this.people.find(1);
            assert.equal(person.get().firstName, 'Luke');
        });
    });

});