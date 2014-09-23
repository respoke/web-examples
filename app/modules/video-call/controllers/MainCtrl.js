App.controllers.videoCallCtrl = (function ($, App) {

    return function (options) {

        var client, connection, call, videoCtrl, buddyListCtrl, callPreviewCtrl, callWarningCtrl, $preview, connected = false, $el = $(options.renderTo), callOptions;

        function onCall (e) {
            var call = e.call;
            if (!call.initiator) {
                call.answer(callOptions);
            }
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
                memberClick: function (endpointId) {
                    connection = client.getEndpoint({
                        id: endpointId
                    });
                    App.controllers.callpromptCtrl({
                        el: $el,
                        makeCall: makeCall,
                        endpointId: endpointId
                    });
                }
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

            call = endpoint.startVideoCall(callOptions);
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
            //call.answer(callOptions);
        }

        (function () {

            callOptions = {
                constraints: {
                    audio: true,
                    video: true
                },
                onRequestingMedia: function (e) {
                    console.log('onRequestingMedia', e, e.target.getLocalElement());
                    callWarningCtrl = App.controllers.callWarningCtrl({
                        el: $el,
                        endpointId: connection.id
                    });
                },
                onAllow: function () {
                    if (callWarningCtrl) {
                        callWarningCtrl.removeWarning();
                    }
                    if (connection) {
                        callPreviewCtrl = App.controllers.callPreviewCtrl({
                            el: $el,
                            endpointId: connection.id,
                            startCall: startCall,
                            cancelCall: call.hangup
                        });
                    }
                },
                onHangup: function (e) {
                    if (videoCtrl) {
                        videoCtrl.removeTemplate();
                    }
                },
                onLocalMedia: function (e) {
                    if (callPreviewCtrl) {
                        $preview = e.element;
                        callPreviewCtrl.renderVideo(e.element);
                    }
                },
                onConnect: function (e) {
                    call = call || e.target;
                    connected = true;
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
                    videoCtrl.renderLocalMedia($preview);
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