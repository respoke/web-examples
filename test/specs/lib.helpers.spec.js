describe('The Shared Helpers', function () {

    describe('when we get the avatar', function () {
        it('should return the correct hashed version', function () {
            var avatar = $.helpers.getAvatar('tcadenhead@appendto.com');
            assert.equal(avatar, 'http://gravatar.com/avatar/4ef1e5bfd76b439a605466192fcc570a?s=52');
        });
    });

    describe('when we get the class name from a string', function () {
        it('should delete all spaces', function () {
            var cls = $.helpers.getClassName('my class');
            assert.equal(cls, 'myclass');
        });
        it('should replace at symbols and periods with underscores', function () {
            var cls = $.helpers.getClassName('my@class.com');
            assert.equal(cls, 'my_class_com');
        });
        it('should convert uppercase characters to lowercase', function () {
            var cls = $.helpers.getClassName('MYCLASS');
            assert.equal(cls, 'myclass');
        });
    });

    describe('when we get the presence class name', function () {
        it('should return unavailable if there are spaces in the text', function () {
            var cls = $.helpers.getPresenceClass('Do Not Disturb');
            assert.equal(cls, 'unavailable');
        });
        it('should convert uppercase to lowercase', function () {
            var cls = $.helpers.getPresenceClass('Away');
            assert.equal(cls, 'away');
        });
    });

    describe('when we insert a template', function () {
        it('should correctly render the template', function () {
            var $el = $.helpers.insertTemplate({
                renderTo: $('<div />'),
                templateString: '<div><p><%= hello %></p></div>',
                data: {
                    hello: 'Hello World'
                }
            });
            assert.equal($el.html(), '<p>Hello World</p>');
        });
        it('should apply events directly to the element', function (done) {
            var $el = $.helpers.insertTemplate({
                renderTo: $('<div />'),
                templateString: '<div><p><%= hello %></p></div>',
                data: {
                    hello: 'Hello World'
                },
                bind: {
                    'click': function () {
                        assert.ok(1);
                        done();
                    }
                }
            });
            $el.trigger('click');
        });
        it('should apply events to child elements', function (done) {
            var $el = $.helpers.insertTemplate({
                renderTo: $('<div />'),
                templateString: '<div><p><%= hello %></p></div>',
                data: {
                    hello: 'Hello World'
                },
                bind: {
                    'p': {
                        'mouseover': function () {
                            assert.ok(1);
                            done();
                        }
                    }
                }
            });
            $el.find('p').trigger('mouseover');
        });
    });

});