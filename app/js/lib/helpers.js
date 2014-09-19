/*global md5 */

(function ($) {

    'use strict';

    $.helpers = {

        /**
         * Returns the gravatar image for the endpoint it
         */
        getAvatar: function (endpointId) {
            return 'http://gravatar.com/avatar/' + md5(endpointId) + '?s=52';
        },

        /**
         * Creates a class name by replacing spaces and invalid characters
         */
        getClassName: function (str) {
            return str.toLowerCase().replace(/ /g, '').replace(/@/g, '_').replace('.', '_');
        },

        /**
         * Returns a class for the presence
         */
        getPresenceClass: function (presence) {
            return (presence.indexOf(' ') !== -1) ? 'unavailable' : this.getClassName(presence);
        },

        insertTemplate: function (options) {

            // Get the contents of the inline template
            var tmpl = $('#' + options.template).html(),

                // Applies the data to the template using John Resig's micro-templating
                el = $.tmpl(tmpl, options.data || {}),

                $el = $(el);

            // Insert or append the element
            options.renderTo[(options.type) ? options.type : 'append']($el);

            // Return the element
            return $el;

        }

    };

}(jQuery));