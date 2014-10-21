App.controllers.buddyCtrl = (function ($) {
    'use strict';

    /**
     * Presence event constant
     * @type {string}
     */
    var PRESENCE_EVENT = 'presence';

    /**
     * The Individual Buddy controller
     * @param {Object} options
     * @param {respoke.Endpoint} endpoint
     */
    return function (options, endpoint) {

        /**
         * Root HTML element
         * @type {jQuery}
         */
        var $el;

        /**
         * Returns the class modified for the user buddy list
         * @param {String} presence
         * @returns {string}
         */
        function getPresenceClass (presence) {
            return 'buddy-list__user__status--' + $.helpers.getPresenceClass(presence);
        }

        /**
         * Renders the status of an individual group member
         */
        function renderMemberStatus (/*e*/) {
            var userClassName = $.helpers.getClassName(endpoint.id),
                $presence = $el.find('.buddy-list #user-' + userClassName + ' .presence > div');
            $presence
                .attr('class', getPresenceClass(endpoint.presence))
                .html(endpoint.presence);
        }

        /**
         * Renders an individual group member
         * @param {respoke.Endpoint} endpoint
         */
        function render () {
            var data = $.extend({}, {
                id: endpoint.id,
                presence: endpoint.presence,
                photo: $.helpers.getAvatar(endpoint.id),
                presenceCls: $.helpers.getPresenceClass(endpoint.presence),
                endpointCls: $.helpers.getClassName(endpoint.id)
            });

            $.helpers.insertTemplate({
                template: 'user-buddy',
                data: data,
                renderTo: $el.find('.buddy-list')
            });
        }

        /**
         * Dispose this controller and remove event handlers
         * from its endpoint.
         */
        function dispose() {
            endpoint.ignore(PRESENCE_EVENT, renderMemberStatus);
            $el = null;
        }

        // initialize this controller
        $el = $(options.renderTo);
        endpoint.listen(PRESENCE_EVENT, renderMemberStatus);
        render();

        /**
         * Public API
         */
        return {
            dispose: dispose
        };
    };

}(jQuery));