App.controllers.userPresenceCtrl = (function ($, App) {

    'use strict';

    /**
     * The User Presence Controller
     */
    return function (options) {

        // The root element will be save in memory
        var $el;

        function NO_OP() {}

        /**
         * Returns the class modified for authenticated user
         */
        function getPresenceClass (presence) {
            return 'user-status-dropdown__status--' + $.helpers.getPresenceClass(presence);
        }

        function renderPresence(presence) {
            // Update the HTML to reflect the presence change
            $el.find('.user-status-dropdown div')
                .html(presence)
                .attr('class', getPresenceClass(presence));
        }

        /**
         * Changes the status of the connected endpoint
         */
        function changeStatus (e) {
            var presence = $(e.target).val();

            renderPresence(presence);

            // Fire an event to let the MainController know that the presence has changed
            (options.onPresenceChange || NO_OP)(presence);
        }

        // Render the authenticated user to the DOM
        function renderUser () {

            // Data to be applied to the template
            var data = $.extend(options, {
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

        /**
         * Initializes the user presence controller
         */
        // Save a reference to the element
        $el = $(options.renderTo);

        // Render the template to the DOM
        renderUser();

        // Listen for changes to the status
        $el.find('.user-status-dropdown__status__select')
            .bind('change', changeStatus);

        // Public API
        return {};

    };

}(jQuery, App));