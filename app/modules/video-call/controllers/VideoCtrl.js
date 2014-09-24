App.controllers.videoCtrl = (function ($, App) {

    'use strict';

    /**
     * The Video Controller
     */
    return function (options) {

        var $el;

        function removeTemplate () {
            $el.find('.video-contain').remove();
        }

        function renderRemoteMedia (video) {
            $el.find('.video-large').html(video);
        }

        function renderLocalMedia (video) {
            $el.find('.video-small').html(video);
            video.play(); // This is a temporary workaround. It will be played automatically in the future
        }

        function hangup () {
            removeTemplate();
            options.onHangup();
        }

        function mute (e) {
            var $target = $(e.target);
            if ($target.text() === 'Mute') {
                $target.text('Unmute');
                options.onMuteAudio();
            } else {
                $target.text('Mute');
                options.onUnmuteAudio();
            }
        }

        function hideVideo (e) {
            var $target = $(e.target);
            if ($target.text() === 'Hide Video') {
                $target.text('Show Video');
                $el.find('.video-small').hide();
                options.onMuteVideo();
            } else {
                $target.text('Hide Video');
                $el.find('.video-small').show();
                options.onUnmuteVideo();
            }
        }

        function mouseenter () {
            $el.find('.video-buttons').fadeIn();
        }

        function mouseleave () {
            $el.find('.video-buttons').fadeOut();
        }

        function render () {
            $.helpers.insertTemplate({
                template: 'video-container',
                renderTo: $el,
                type: 'html',
                data: {},
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

        /**
         * Initializes the controller
         */
         (function () {
            $el = options.el;
            render();
         }());

        /**
         * Public API
         */
        return {
            renderLocalMedia: renderLocalMedia,
            renderRemoteMedia: renderRemoteMedia,
            removeTemplate: removeTemplate
        };

    };

}(jQuery, App));