App.controllers.buddyListCtrl = (function ($, App) {

    'use strict';

    // The buddy list controller
    return function (options) {

        var $closeBtn = $('.group-list-close'),
            $openBtn = $('.group-list-open');

        // Checks the status of the group list. If there is one, we open the menu, otherwise, close it
        function checkStatus () {
            if ($('.group-list').length) {
                openMenu();
            } else {
                closeMenu();
            }
        }

        // Hides the menu
        function hideMenu (e) {
            var $openedMenu = $(e.target).closest('.group-list--is-open');

            // Make sure the open menu is empty and the target is not the open button itself 
            if ( (!$openedMenu.length) && ($(e.target)[0] !== $openBtn[0]) ) {
                closeMenu();
            }
        }

        // Opens the menu for mobile device
        function openMenu () {

            // Animate the menu in
            $('html, body').animate({
                scrollTop: 0
            }, 500);

            $('.group-list').removeClass('group-list').addClass('group-list--is-open');
            $('.group-chat').removeClass('group-chat').addClass('group-chat--open-panel');
        }

        // Closes the menu on mobile devices
        function closeMenu () {
            $('.group-list--is-open').removeClass('group-list--is-open').addClass('group-list');
            $('.group-chat--open-panel').addClass('group-chat').removeClass('group-chat--open-panel');
        }

        // When a group member is clicked
        function memberClick (e) {

            // Get the endpointId from the data on the DOM element
            var endpointId = $(e.target).data('id');

            // 
            return (options.memberClick) ? options.memberClick(endpointId) : null;
        }

        // Renders the group member that is passed in
        function renderGroupMember (key, endpoint) {

            // Only add the group member if it is not the authenticated endpoint
            if (endpoint.endpointId !== options.endpointId) {

                // Render the template
                $.helpers.insertTemplate({
                    template: 'buddy-list-user',
                    renderTo: options.el,
                    type: 'append',
                    data: endpoint,
                    bind: {
                        'click': memberClick
                    }
                });

            }
        }

        // Renders all the members of a group
        function renderGroup (members) {
            $.each(members, renderGroupMember);
        }

        // Removes a member from the group
        function removeMember (endpointId) {

            // Find the class name for the endpointId
            var cls = $.helpers.getClassName(endpointId);

            // Remove the list element
            options.el.find('#user-' + cls).remove();
        }

        // Initialize the buddy list
        (function () {
            $openBtn.bind('click', checkStatus);
            $closeBtn.bind('click', closeMenu);
            $('body').bind('click', hideMenu);
        }());

        // Expose a public API
        return {
            renderGroupMember: renderGroupMember,
            renderGroup: renderGroup,
            removeMember: removeMember
        };

    };

}(jQuery, App));