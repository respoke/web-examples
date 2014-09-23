App.controllers.buddyListCtrl = (function ($, App) {

    return function (options) {

        var $openBtn = $('.group-list-open'),
            $closeBtn = $('.group-list-close');

        function checkStatus () {
            if ($('.group-list').length) {
                openMenu();
            } else {
                closeMenu();
            }
        }

        function hideMenu (e) {
            var $openedMenu = $(e.target).closest('.group-list--is-open');

            if ( ($openedMenu.length === 0) && ($(e.target)[0] !== $openBtn[0]) ) {
                closeMenu();
            }
        }

        function openMenu () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            $('.group-list').removeClass('group-list').addClass('group-list--is-open');
            $('.group-chat').removeClass('group-chat').addClass('group-chat--open-panel');
        }

        function closeMenu () {
            $('.group-list--is-open').removeClass('group-list--is-open').addClass('group-list');
            $('.group-chat--open-panel').addClass('group-chat').removeClass('group-chat--open-panel');
        }

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

        (function () {
            $openBtn.on('click', checkStatus);
            $closeBtn.on('click', closeMenu);
            $('body').on('click', hideMenu);
        }());

        return {
            renderGroupMember: renderGroupMember,
            renderGroup: renderGroup,
            removeMember: removeMember
        };

    };

}(jQuery, App));