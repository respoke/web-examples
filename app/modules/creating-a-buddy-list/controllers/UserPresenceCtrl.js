App.controllers.userPresenceCtrl = (function ($, App) {

    'use strict';

    return function (options) {

        return {

            /**
             * Returns the class modified for authenticated user
             */
            getPresenceClass: function (presence) {
                return 'user-status-dropdown__status--' + $.helpers.getPresenceClass(presence);
            },

            /**
             * Changes the status of the connected endpoint
             */
            changeStatus: function (e) {
                var presence = $(e.target).val();

                this.el.find('.user-status-dropdown div')
                    .html(presence)
                    .attr('class', this.getPresenceClass(presence));

                if (typeof options.onPresenceChange === 'function') {
                    options.onPresenceChange(presence);
                }
            },

            /**
             * Render the authenticated user to the DOM
             */
            renderUser: function () {

                // Get the contents of the inline template
                var tmpl = $('#user-status').html(),

                    data = $.extend(options, {
                        statusTypes: App.models.statusTypes(),
                        presenceCls: $.helpers.getPresenceClass(options.presence),
                        photo: $.helpers.getAvatar(options.endpointId)
                    }),

                    // Applies the data to the template using John Resig's micro-templating
                    html = $.tmpl(tmpl, data);

                this.el.html(html);

                this.el.find('.user-status-dropdown__status__select').bind('change', this.changeStatus.bind(this));

            },

            /**
             * Initializes the user presence controller
             */
            init: function () {
                this.el = $(options.renderTo);
                this.renderUser();
            }

        };

    };

}(jQuery, App));