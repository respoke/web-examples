App.controllers.buddyListCtrl = (function ($, App) {

    return function (options) {

        function memberClick (e) {
            var endpointId = $(e.target).data('id');
            options.memberClick(endpointId);
        }

        function renderGroupMember (key, endpoint) {
            if (String(endpoint.endpointId) !== String(options.endpointId)) {
                var tmpl = $('#buddy-list-user').html(),
                    html = $.tmpl(tmpl, endpoint),
                    $el = $(html);
                options.el.append($el);
                $el.bind('click', memberClick);
            }
        }

        function renderGroup (members) {
            $.each(members, renderGroupMember);
        }

        function removeMember (endpointId) {
            var cls = $.helpers.getClassName(endpointId);
            options.el.find('#user-' + cls).remove();
        }

        return {
            renderGroupMember: renderGroupMember,
            renderGroup: renderGroup,
            removeMember: removeMember
        };

    };

}(jQuery, App));