App.controllers.videoCtrl = (function ($, App) {

    'use strict';

    // The Video Controller
    return function (options) {

        var $el;

        // Removes the entire video template from the DOM
        function removeTemplate () {
            $el.find('.video-contain').remove();
        }

        // Renders the remote video
        function renderRemoteMedia (video) {
            $el.find('.video-large').html(video);
        }

        // Renders the local video
        function renderLocalMedia (video) {
            $el.find('.video-small').html(video);

            // TODO: This is a temporary workaround. It will be played automatically in the future
            video.play();
        }

        // Hangs up the current call
        function hangup () {
            removeTemplate();
            return (options.onHangup) ? options.onHangup() : null;
        }

        // Mutes the audio. Toggles the "Mute" button to read "Unmute"
        function mute (e) {
            var $target = $(e.target);

            // Mutes the audio
            if ($target.text() === 'Mute') {
                $target.text('Unmute');

                // Calls the onMuteAudio method that was passed in as an option
                return (options.onMuteAudio) ? options.onMuteAudio() : null;

            // Unmutes the audio
            } else {
                $target.text('Mute');

                // Calls the onUnmuteAudio method that was passed in as an option
                return (options.onUnmuteAudio) ? options.onUnmuteAudio() : null;
            }
        }

        // Toggles the video on and off
        function hideVideo (e) {
            var $target = $(e.target);

            // Hide the video
            if ($target.text() === 'Hide Video') {
                $target.text('Show Video');

                // Hide the local video
                $el.find('.video-small').hide();

                // Calls the onMuteVideo method from the options so that 
                // the connected endpoint will no longer see our video
                options.onMuteVideo();

            // Show the video
            } else {
                $target.text('Hide Video');

                // Show the local video
                $el.find('.video-small').show();

                // Calls the onUnmuteVideo method from the options so that
                // the connected endpoint can see our video again
                options.onUnmuteVideo();
            }
        }

        // When the mouse is inside the video area, we want to show the buttons
        // to hangup, mute and hide video
        function mouseenter () {
            $el.find('.video-buttons').fadeIn();
        }

        // When the mouse leaves the video area, hide the buttons
        function mouseleave () {
            $el.find('.video-buttons').fadeOut();
        }

        // Render the video container using our `insertTemplate` helper
        function render () {
            $.helpers.insertTemplate({

                template: 'video-container',
                renderTo: $el,
                type: 'html',
                data: options,

                // Bind various event listeners to the template
                bind: {
                    '#hangup': {
                        'click': hangup
                    },
                    '#mute': {
                        'click': mute
                    },
                    '#hide-video': {
                        'click': hideVideo
                    },
                    'mouseenter': mouseenter,
                    'mouseleave': mouseleave
                }
            });
        }

         // Initializes the controller
         (function () {
            $el = options.el;
            render();
         }());

        // Expose a public API
        return {
            renderLocalMedia: renderLocalMedia,
            renderRemoteMedia: renderRemoteMedia,
            removeTemplate: removeTemplate
        };

    };

}(jQuery, App));