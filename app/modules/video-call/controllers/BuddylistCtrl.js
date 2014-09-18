App.controllers.buddyListCtrl = (function ($, App) {

    return function (options) {

        return {

            memberClick: function (e) {
                var endpointId = $(e.target).data('id');
                options.memberClick(endpointId);
            },

            /**
             * Renders a single group member
             */
            renderGroupMember: function (key, endpoint) {
                if (String(endpoint.endpointId) !== String(options.endpointId)) {
                    var tmpl = $('#buddy-list-user').html(),
                        html = $.tmpl(tmpl, endpoint),
                        $el = $(html);
                    options.el.append($el);
                    $el.bind('click', this.memberClick.bind(this));
                }
            },

            /**
             * Renders all of the current group members
             */
            renderGroup: function (members) {
                $.each(members, this.renderGroupMember.bind(this));
            },

            /**
             * When a group member leaves, we can remove them from the DOM
             */
            removeMember: function (endpointId) {
                var cls = $.helpers.getClassName(endpointId);
                options.el.find('#user-' + cls).remove();
            }

        };

    };

}(jQuery, App));