App.controllers.videoCallCtrl = (function ($, App) {

    return function (options) {

        var client, connection, call, videoCtrl, buddyListCtrl, callPreviewCtrl, callWarningCtrl, localMedia, $el = $(options.renderTo), callOptions;

        function onCall (e) {
            call = e.call;
            if (!call.initiator) {
                call.answer(callOptions);
            }
        }

        function memberClick (endpointId) {
            connection = client.getEndpoint({
                id: endpointId
            });
            App.controllers.callpromptCtrl({
                el: $el,
                makeCall: makeCall,
                endpointId: endpointId
            });
        }

        function onConnection (e) {
            client = e;
            client.listen('call', onCall);
            var html = $.helpers.insertTemplate({
                template: 'video-chat',
                data: {},
                type: 'html',
                renderTo: $el
            });
            buddyListCtrl = App.controllers.buddyListCtrl({
                endpointId: options.username,
                el: $el.find('.buddy-list--mini'),
                memberClick: memberClick
            });
            client.join({
                id: 'video-group-3',
                onSuccess: getGroup
            });
        }

        function makeCall () {
            var endpoint = client.getEndpoint({
                id: connection.id
            });
            endpoint.startVideoCall(callOptions);
        }

        function getGroup (group) {
            group.listen('join', function (e) {
                buddyListCtrl.renderGroupMember(null, e.connection);
            });
            group.listen('leave', function (e) {
                if (call && call.remoteEndpoint.id === e.connection.endpointId) {
                    call.hangup();
                }
                buddyListCtrl.removeMember(e.connection.endpointId);
                
            });
            group.getMembers({
                onSuccess: buddyListCtrl.renderGroup
            });
        }

        function startCall () {
            call.approve();
        }

        function hangup () {
            call.hangup();
        }

        (function () {

            callOptions = {
                constraints: {
                    audio: true,
                    video: true
                },
                onRequestingMedia: function (e) {
                    callWarningCtrl = App.controllers.callWarningCtrl({
                        el: $el,
                        endpointId: e.target.remoteEndpoint.id
                    });
                },
                onAllow: function () {
                    if (callWarningCtrl) {
                        callWarningCtrl.removeWarning();
                    }
                },
                onHangup: function (e) {
                    if (videoCtrl) {
                        videoCtrl.removeTemplate();
                    }
                },
                previewLocalMedia: function (video) {
                    callPreviewCtrl = App.controllers.callPreviewCtrl({
                        el: $el,
                        startCall: startCall,
                        cancelCall: hangup
                    });
                    callPreviewCtrl.renderVideo(video);
                },
                onConnect: function (e) {
                    if (callPreviewCtrl) {
                        callPreviewCtrl.removePreview();
                    }
                    videoCtrl = App.controllers.videoCtrl({
                        el: $el.find('.video-chat'),
                        onHangup: call.hangup,
                        onMuteAudio: call.muteAudio,
                        onMuteVideo: call.muteVideo,
                        onUnmuteAudio: call.unmuteAudio,
                        onUnmuteVideo: call.unmuteVideo
                    });
                    videoCtrl.renderRemoteMedia(e.element);
                    videoCtrl.renderLocalMedia(e.target.getLocalElement());
                }
            };

            App.controllers.authenticationCtrl({
                onConnection: onConnection,
                renderTo: options.renderTo
            });
        }());

        return {};

    };

}(jQuery, App));