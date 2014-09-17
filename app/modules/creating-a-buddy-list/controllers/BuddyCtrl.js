App.controllers.buddyCtrl = (function ($, App) {

    'use strict';

    /**
     * The Individual Buddy controller
     */
    return function (options) {

        return {

            /**
             * Returns the class modified for the user buddy list
             */
            getPresenceClass: function (presence) {
                return 'buddy-list__user__status--' + $.helpers.getPresenceClass(presence);
            },

            /**
             * Renders the status of an individual group member
             */
            renderMemberStatus: function (e) {
                var m = e.connection || e.target,
                    $el = this.el.find('.buddy-list #user-' + $.helpers.getClassName(m.endpointId) + ' .presence > div');
                $el
                    .attr('class', this.getPresenceClass(m.presence))
                    .html(m.presence);
            },

            /**
             * Renders an individual group member
             */
            render: function (endpoint) {
                var tmpl = $('#user-buddy').html(), html;
                endpoint = $.extend(endpoint, {
                    photo: $.helpers.getAvatar(endpoint.endpointId),
                    presenceCls: $.helpers.getPresenceClass(endpoint.presence),
                    endpointCls: $.helpers.getClassName(endpoint.endpointId)
                });
                html = $.tmpl(tmpl, endpoint);
                this.el.find('.buddy-list').append(html);
            },

            /**
             * Initialize this controller
             */
            init: function (endpoint) {
                this.endpointId = endpoint.endpointId;
                this.el = $(options.renderTo);
                this.render(endpoint);
                endpoint.listen('presence', this.renderMemberStatus.bind(this));
            }

        };

    };

}(jQuery, App));