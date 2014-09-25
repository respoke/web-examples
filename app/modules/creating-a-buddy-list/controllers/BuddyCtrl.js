App.controllers.buddyCtrl = (function ($, App) {

    'use strict';

    /**
     * The Individual Buddy controller
     */
    return function (options, endpoint) {

        // The root element will be kept in memory
        var $el;

        // Returns the class modified for the user buddy list
        function getPresenceClass (presence) {
            return 'buddy-list__user__status--' + $.helpers.getPresenceClass(presence);
        }

        /**
         * Renders the status of an individual group member
         * @param {Object} e - endpoint event
         */
        function renderMemberStatus (e) {
            var m = e.connection || e.target,
                $presence = $el.find('.buddy-list #user-' + $.helpers.getClassName(m.id) + ' .presence > div');
            $presence
                .attr('class', getPresenceClass(m.presence))
                .html(m.presence);
        }

        // Renders an individual group member
        function render (endpoint) {
            var data = $.extend(endpoint, {
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
         * Initialize this controller
         */
        $el = $(options.renderTo);
        endpoint.listen('presence', renderMemberStatus);
        render(endpoint);

        return {};
    };

}(jQuery, App));