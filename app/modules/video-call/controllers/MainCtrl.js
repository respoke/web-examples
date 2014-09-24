App.controllers.videoCallCtrl = (function ($, App) {

    return function (options) {

        // This will contain the call object once a video call is established
        var call = null,

            // This will contain the client object once a client is connected
            client = null,

            // This will contain the connection object once a connection has been established
            connection = null,

            // This object contains all of the instantiated controllers
            ctrl = {},

            // The primary controller
            $el = $(options.renderTo);

        // Returns the options for a new call
        function getCallOptions () {
            return {
                constraints: {
                    audio: true,
                    video: true
                },
                onHangup: hangup,
                onRequestingMedia: onRequestingMedia,
                onAllow: onAllow,
                previewLocalMedia: previewLocalMedia,
                onConnect: onCallConnect
            };
        }

        // This is a callback when a call is established
        function onCall (e) {
            call = e.call;

            // If the client is not the initiator, answer the call
            if (!call.initiator) {
                call.answer(getCallOptions());
            }
        }

        // When the member is clicked, we need to prompt the client about the call
        function memberClick (endpointId) {

            // Establish a connection
            connection = client.getEndpoint({
                id: endpointId
            });

            // Render the modal window
            App.controllers.callpromptCtrl({
                el: $el,
                makeCall: makeCall,
                endpointId: endpointId
            });
        }

        // Callback when the connection is established for a client
        function onConnection (e) {

            // Set the global client variable
            client = e;
            client.listen('call', onCall);

            // Render the video chat modal
            $.helpers.insertTemplate({
                template: 'video-chat',
                data: {},
                type: 'html',
                renderTo: $el
            });

            // Every endpoint who visits this page will join the same group
            client.join({
                id: 'video-group-chat',
                onSuccess: getGroup
            });
        }

        // Starts a call with the connection we've already established
        function makeCall () {

            // Grab the connected endpoint
            var endpoint = client.getEndpoint({
                id: connection.id
            });

            // Start the video call
            endpoint.startVideoCall(getCallOptions());
        }

        // Gets the group and adds some event listeners
        function getGroup (group) {

            // Group event listeners
            group.listen('join', onGroupJoin);
            group.listen('leave', onGroupLeave);

            // Render the buddy list to the DOM
            ctrl.buddyList = App.controllers.buddyListCtrl({
                endpointId: client.endpointId,
                el: $el.find('.buddy-list--mini'),
                memberClick: memberClick
            });

            // Get the group members and render them with the buddy list controller
            group.getMembers({
                onSuccess: ctrl.buddyList.renderGroup
            });
        }

        // A callback when an endpoint leaves the group
        function onGroupLeave (e) {

            // If the client is currently having a call with the endpoint, we need to hang that up
            if (call && call.remoteEndpoint.id === e.connection.endpointId) {
                call.hangup();
            }

            // Remove the endpoint from the buddy list
            ctrl.buddyList.removeMember(e.connection.endpointId);
            
        }

        // A callback when a member joins the group
        function onGroupJoin (e) {
            ctrl.buddyList.renderGroupMember(null, e.connection);
        }

        // Starts a video call
        function startCall () {
            call.approve();
        }

        // Hangs up a video call
        function hangup () {

            // Hang up the call
            call.hangup();

            // Remove the video template if there is one
            if (ctrl.video) {
                ctrl.video.removeTemplate();
            }

            // Clear the connection object
            connection = null;

            // Clear the call object
            call = null;

        }

        // Callback when the access to the camera and microphone are requested
        function onRequestingMedia (e) {

            // Render the call warning modal to the DOM
            ctrl.callWarning= App.controllers.callWarningCtrl({
                el: $el,
                endpointId: e.target.remoteEndpoint.id,
                initiator: e.target.caller
            });

        }

        // When the camera and microphone are allowed to function
        function onAllow () {

            // Remove the warning modal from the DOM
            return (ctrl.callWarning) ? ctrl.callWarning.removeWarning() : 0;

        }

        // Shows a preview of the local camera so the client can make sure they look okay
        function previewLocalMedia (video) {

            // Render the modal
            ctrl.callPreview = App.controllers.callPreviewCtrl({
                el: $el,
                startCall: startCall,
                cancelCall: hangup,
                initiator: !!connection
            });

            // Add the preview video
            ctrl.callPreview.renderVideo(video);
        }

        // When a call is connected
        function onCallConnect (e) {

            // If there is a preview modal, remove it from the DOM
            if (ctrl.callPreview) {
                ctrl.callPreview.removePreview();
            }

            // Render the video to the video-chat element
            ctrl.video = App.controllers.videoCtrl({
                el: $el.find('.video-chat'),
                onHangup: call.hangup,
                onMuteAudio: call.muteAudio,
                onMuteVideo: call.muteVideo,
                onUnmuteAudio: call.unmuteAudio,
                onUnmuteVideo: call.unmuteVideo
            });

            // Render the remote video
            ctrl.video.renderRemoteMedia(e.element);

            // Render the local video
            ctrl.video.renderLocalMedia(e.target.getLocalElement());
        }

        // This is instantiated immediately
        (function () {
            App.controllers.authenticationCtrl({
                onConnection: onConnection,
                renderTo: options.renderTo
            });
        }());

        // Public API
        return {};

    };

}(jQuery, App));