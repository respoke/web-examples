describe('The Buddy List View', function () {

    beforeEach(function () {
        this.ctrl = App.controllers.buddylistCtrl();
    });

    /*describe('when we get the class for our buddy list presence', function () {
        it('should return an under-cased string', function () {
            var cls = this.ctrl.getBuddyListPresenceClass.call(this.ctrl, 'MyCurrentPresence');
            assert.equal(cls, 'buddy-list__user__status--mycurrentpresence');
        });
        it('should return an unavailable since there are spaces in the string', function () {
            var cls = this.ctrl.getBuddyListPresenceClass.call(this.ctrl, 'My Current Presence');
            assert.equal(cls, 'buddy-list__user__status--unavailable');
        });
    });*/

    describe('when we get the avatar', function () {
        it('should return a gravatar link', function () {
            var avatar = $.helpers.getAvatar('tcadenhead@appendto.com');
            assert.equal(avatar, 'http://gravatar.com/avatar/4ef1e5bfd76b439a605466192fcc570a?s=52');
        });
    });

});