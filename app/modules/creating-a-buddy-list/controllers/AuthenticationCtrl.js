App.controllers.authenticationCtrl = (function ($, App) {

    'use strict';

    return function (options) {

        return {

            /**
             * A callback when the name is submitted
             */
            submitName: function (e) {

                // Prevent the form from posting back
                e.preventDefault();

                // Get the username from the form
                var username = this.el.find('.cbl-name__text').val();

                // Disable the form
                $(e.target).find('input').attr('disabled', 'disabled');

                // Connect the client
                App.models.client(username, options.onConnection);

            },

            /**
             * Renders the authentication form
             */
            renderForm: function () {
                var tmpl = $('#user-authentication').html();
                this.el.html(tmpl);
                this.el.find('.cbl-name').bind('submit', this.submitName.bind(this));
            },

            /**
             * Initializes the controller
             */
            init: function () {
                this.el = $(options.renderTo);
                this.renderForm();
            }

        };

    };

}(jQuery, App));