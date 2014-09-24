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

        // Renders the status of an individual group member
        function renderMemberStatus (e) {
            var m = e.connection || e.target,
                $presence = $el.find('.buddy-list #user-' + $.helpers.getClassName(m.endpointId) + ' .presence > div');
            $presence
                .attr('class', getPresenceClass(m.presence))
                .html(m.presence);
        }

        // Renders an individual group member
        function render (endpoint) {
            var data = $.extend(endpoint, {
                photo: $.helpers.getAvatar(endpoint.endpointId),
                presenceCls: $.helpers.getPresenceClass(endpoint.presence),
                endpointCls: $.helpers.getClassName(endpoint.endpointId)
            });

            $.helpers.insertTemplate({
                template: 'user-buddy',
                data: data,
                renderTo: $el.find('.buddy-list')
            });
        }

        // Initialize this controller
        (function () {
            $el = $(options.renderTo);
            render(endpoint);
            endpoint.listen('presence', renderMemberStatus);
        }());

        return {};

    };

}(jQuery, App));