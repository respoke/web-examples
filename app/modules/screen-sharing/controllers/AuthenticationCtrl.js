App.controllers.authenticationCtrl = (function ($, App) {

    'use strict';

    // The Authentication Controller
    return function (options) {

        var $el;
        var chromeUrl = 'https://chrome.google.com/webstore/detail/jlpojfookfonjolaeofpibngfpnnflne';
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

        function clickChromeExtension(e) {
            e.preventDefault();
            chrome.webstore.install(chromeUrl, function(){
                console.log('Successfully installed Chrome Extension, reloading page');
                window.location.reload();
            }, function(err){
                console.error('Error installing extension in chrome', err);
                console.error('Chrome webstore URL is', chromeUrl);
            });
        }

        function clickFirefoxExtension(e) {
            e.preventDefault();
            var params = {
                Foo: {
                    URL: '/web-examples-respoke.xpi',
                    //IconURL: aEvent.target.getAttribute("iconURL"),
                    Hash: 'sha1:497e58f0ae0b9df8037c9925173f664a58de2580',
                    toString: function () {
                        return this.URL;
                    }
                }
            };
            InstallTrigger.install(params);
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
                    '.chrome-screen-share-instructions button': {
                        'click': clickChromeExtension
                    },
                    '#installFirefoxExtension': {
                        'click': clickFirefoxExtension
                    }
                }
            });

            function removeInstructions(){
                if (!respoke.needsChromeExtension || respoke.hasChromeExtension) {
                    $el.find('.chrome-screen-share-instructions').remove();
                }

                if (!respoke.needsFirefoxExtension || respoke.hasFirefoxExtension) {
                    $el.find('.firefox-screen-share-instructions').remove();
                }
            }

            respoke.listen('extension-ready', removeInstructions);

            removeInstructions();
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
