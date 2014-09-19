App.controllers.videoCallCtrl = (function ($, App) {

    return function (options) {

        var client, connection, call, buddyListCtrl, callPreviewCtrl, callWarningCtrl, $el;

        function onMemberJoin (e) {
            buddyListCtrl.renderGroupMember(null, e.connection);
        }

        function onMemberLeave (e) {
            buddyListCtrl.removeMember(e.connection.endpointId);
        }

        function onAllow () {
            callWarningCtrl.removeWarning();
            callPreviewCtrl = App.controllers.callPreviewCtrl({
                el: $el,
                endpointId: connection.id,
                startCall: startCall,
                cancelCall: call.hangup
            });
        }

        function onCall (e) {
            console.log('onCall', e);
        }

        function onConnection () {
            client.listen('call', onCall);
            joinGroup();
        }

        function getGroup (group) {
            group.listen('join', onMemberJoin);
            group.listen('leave', onMemberLeave);
            group.getMembers({
                onSuccess: buddyListCtrl.renderGroup
            });
        }

        function joinGroup () {
            client.join({
                id: 'video-group',
                onSuccess: getGroup
            });
        }

        function startCall () {
            call.answer();
            console.log('startCall', call);
        }

        function previewLocalMedia (video) {
            callPreviewCtrl.renderVideo(video)
        }

        function makeCall () {

            var endpoint = client.getEndpoint({
                id: connection.id
            });

            callWarningCtrl = App.controllers.callWarningCtrl({
                el: $el,
                endpointId: connection.id
            });

            call = endpoint.startVideoCall({
                constraints: {
                    audio: true,
                    video: true
                },
                onAllow: onAllow,
                previewLocalMedia: previewLocalMedia
            });
        }

        function promptCall (endpointId) {
            connection = client.getEndpoint({
                id: endpointId
            });
            App.controllers.callpromptCtrl({
                el: $el,
                makeCall: makeCall,
                endpointId: endpointId
            });
        }

        (function () {
            $el = $(options.renderTo);
            buddyListCtrl = App.controllers.buddyListCtrl({
                endpointId: options.username,
                el: $el.find('.buddy-list--mini'),
                memberClick: promptCall
            });
            App.models.client(options.username, onConnection);
        }());

        return {};

    };

}(jQuery, App));