/*global md5 */

(function ($) {

    'use strict';

    $.helpers = {

        // Returns the gravatar image for the endpoint it
        getAvatar: function (endpointId) {
            return 'http://gravatar.com/avatar/' + md5(endpointId) + '?s=52';
        },

        // Creates a class name by replacing spaces and invalid characters
        getClassName: function (str) {
            return str.toLowerCase().replace(/ /g, '').replace(/@/g, '_').replace('.', '_');
        },

        // Returns a class for the presence
        getPresenceClass: function (presence) {
            var presenceClass = (presence.indexOf(' ') !== -1) ? 'unavailable' : this.getClassName(presence);
            console.log('>>', presence, '=>', presenceClass);
            return presenceClass;
        },

        // Inserts a template
        insertTemplate: function (options) {

            // Get the contents of the inline template
            var tmpl = options.templateString || $('#' + options.template).html(),

                // Applies the data to the template using John Resig's micro-templating
                el = $.tmpl(tmpl, options.data || {}),

                $el = $(el);

            // Insert or append the element
            options.renderTo[(options.type) ? options.type : 'append']($el);

            // Allow the user to bind events to the template
            if (options.bind) {
                for (var element in options.bind) {
                    if (options.bind.hasOwnProperty(element)) {

                        // Bind the event directly to the root element
                        if (typeof options.bind[element] === 'function') {
                            $el.bind(element, options.bind[element]);

                        // Find an element in the root element and apply the events
                        } else {
                            for (var evt in options.bind[element]) {
                                if (options.bind[element].hasOwnProperty(evt)) {
                                    $el.find(element).bind(evt, options.bind[element][evt]);
                                }
                            }
                        }
                    }
                }
            }

            // Return the element
            return $el;

        }

    };

}(jQuery));