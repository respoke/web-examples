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
        }

    };

}(jQuery));