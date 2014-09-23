App.controllers.videoCtrl = (function ($, App) {

    'use strict';

    /**
     * The Video Controller
     */
    return function (options) {

        var $el;

        function removeTemplate () {
            $el.find('.videos-container').remove();
        }

        function renderRemoteMedia (video) {
            $el.find('.video-large').html(video);
        }

        function renderLocalMedia (video) {
            $el.find('.video-small').html(video);
        }

        function render () {
            $.helpers.insertTemplate({
                template: 'video-container',
                renderTo: $el,
                type: 'html',
                data: {}
            });

            $el.find('#hangup').bind('click', function () {
                removeTemplate();
                options.onHangup();
            });

            $el.find('#mute').bind('click', function (e) {
                var $target = $(e.target);
                if ($target.text() === 'Mute') {
                    $target.text('Unmute');
                    options.onMuteAudio();
                } else {
                    $target.text('Mute');
                    options.onUnmuteAudio();
                }
            });

            $el.find('#hide-video').bind('click', function (e) {
                var $target = $(e.target);
                if ($target.text() === 'Hide Video') {
                    $target.text('Show Video');
                    options.onMuteVideo();
                } else {
                    $target.text('Hide Video');
                    options.onUnmuteVideo();
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