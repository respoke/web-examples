App.controllers.authenticationCtrl = (function ($, App) {

    'use strict';

    // The Authentication Controller
    return function (options) {

        var $el;

        // A callback when the name is submitted
        function submitName (e) {

            // Prevent the form from posting back
            e.preventDefault();

            // Get the username from the form
            var username = $el.find('.cbl-name__text').val();

            // Disable the form
            $(e.target).find('input').attr('disabled', 'disabled');

            // Connect the client
            App.models.client(username, options.onConnection);

            // hide the the description text
            var desc = $('.app-description');
            desc.css('display','none');
            desc = null;
        }

        function clickExtension(e){
            e.preventDefault();
            chrome.webstore.install('https://chrome.google.com/webstore/detail/jlpojfookfonjolaeofpibngfpnnflne', function(){
                console.log('Successfully installed Chrome Extension, reloading page');
                window.location.reload();
            }, function(err){
                console.log('Error installing extension in chrome', err);
            });
        }

        // Renders the authentication form
        function renderForm () {
            $el = $.helpers.insertTemplate({
                template: 'user-authentication',
                renderTo: $el,
                type: 'html',
                bind: {
                    '.cbl-name': {
                        'submit': submitName
                    },
                    '.screen-share-instructions button': {
                        'click': clickExtension
                    }
                }
            });
            if (!respoke.needsChromeExtension || (respoke.needsChromeExtension && respoke.hasChromeExtension)) {
                $el.find('.screen-share-instructions').remove();
            }
        }

        // Initializes the controller
         (function () {
            $el = $(options.renderTo);
            renderForm();
         }());

        // Exposes a public API
        return {};

    };

}(jQuery, App));
