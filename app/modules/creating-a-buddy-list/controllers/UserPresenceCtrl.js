App.controllers.userPresenceCtrl = (function ($, App) {
    'use strict';

    /**
     * The User Presence Controller
     * @param {Object} options
     */
    return function (options) {

        /**
         * Handle to the root HTML element
         * @type jQuery
         */
        var $el;

        /**
         * No-Op function
         */
        function NO_OP() {}

        /**
         * Returns the class modified for authenticated user
         * @param {String} presence
         */
        function getPresenceClass (presence) {
            return 'user-status-dropdown__status--' + $.helpers.getPresenceClass(presence);
        }

        /**
         * Update the "label" in the presence drop-down to reflect the presence change
         * @param {String} presence
         */
        function renderPresence(presence) {
            $el.find('.user-status-dropdown div')
                .html(presence)
                .attr('class', getPresenceClass(presence));
        }

        /**
         * Changes the status of the connected endpoint
         * @param {{target: HTMLElement}} e - jQuery event
         */
        function changeStatus (e) {
            var presence = $(e.target).val();

            renderPresence(presence);

            // Fire an event to let the MainCtrl know that the presence has changed
            (options.onPresenceChange || NO_OP)(presence);
        }

        /**
         * Render the authenticated user to the DOM
         */
        function renderUser () {
            // Data to be applied to the template
            var data = $.extend({}, {
                endpointId: options.endpointId,
                presence: options.presence,
                statusTypes: App.models.statusTypes(),
                presenceCls: $.helpers.getPresenceClass(options.presence),
                photo: $.helpers.getAvatar(options.endpointId)
            });

            $.helpers.insertTemplate({
                template: 'user-status',
                data: data,
                renderTo: $el,
                type: 'html'
            });

        }

        // initialize the user presence controller
        $el = $(options.renderTo);

        // render the template to the DOM
        renderUser();

        // listen for changes to the status
        $el.find('.user-status-dropdown__status__select')
            .bind('change', changeStatus);
    };

}(jQuery, App));