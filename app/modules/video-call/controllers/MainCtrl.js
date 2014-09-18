App.controllers.videoCallCtrl = (function ($, App) {

    return function (options) {

        var client;

        return {

            /**
             * When a group member joins, we need to add them to the group list
             */
            onMemberJoin: function (e) {
                this.buddyList.renderGroupMember(null, e.connection);
            },

            /**
             * When a group member leaves, we can remove them from the DOM
             */
            onMemberLeave: function (e) {
                this.buddyList.removeMember(e.connection.endpointId);
            },

            /**
             * Gets the members of a group and listens for additions and subtractions
             */
            getGroup: function (group) {
                group.listen('join', this.onMemberJoin.bind(this));
                group.listen('leave', this.onMemberLeave.bind(this));
                group.getMembers({
                    onSuccess: this.buddyList.renderGroup.bind(this.buddyList)
                });
            },

            /**
             * Join a group
             */
            joinGroup: function () {
                client.join({
                    id: 'video-group',
                    onSuccess: this.getGroup.bind(this)
                });
            },

            startCall: function () {
                this.call.answer();
                console.log('startCall', this.call);
            },

            onAllow: function () {
                this.callWarningCtrl.remove();
                this.callPreviewCtrl = App.controllers.callPreviewCtrl({
                    el: this.el,
                    endpointId: this.connection.id,
                    startCall: this.startCall.bind(this)
                });
            },

            previewLocalMedia: function (video) {
                this.callPreviewCtrl.renderVideo(video)
            },

            makeCall: function () {
                this.callWarningCtrl = App.controllers.callWarningCtrl({
                    el: this.el,
                    endpointId: this.connection.id
                });
                this.call = client.startCall({
                    endpointId: this.connection.id,
                    onAllow: this.onAllow.bind(this),
                    previewLocalMedia: this.previewLocalMedia.bind(this)
                });
            },

            promptCall: function (endpointId) {
                this.connection = client.getEndpoint({
                    id: endpointId
                });
                App.controllers.callpromptCtrl({
                    el: this.el,
                    makeCall: this.makeCall.bind(this),
                    endpointId: endpointId
                });
            },

            onCall: function (e) {
                console.log('onCall', e);
            },

            onConnection: function (_client) {
                client = _client;
                client.listen('call', this.onCall.bind(this));
                this.joinGroup();
            },

            init: function () {
                this.el = $(options.renderTo);
                this.buddyList = App.controllers.buddyListCtrl({
                    endpointId: options.username,
                    el: this.el.find('.buddy-list--mini'),
                    memberClick: this.promptCall.bind(this)
                });
                App.models.client(options.username, this.onConnection.bind(this));
            }

        };

    };

}(jQuery, App));