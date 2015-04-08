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

        function clickInstallExtension(e) {
            e.preventDefault();

            if (respoke.needsChromeExtension && !respoke.hasChromeExtension) {
                console.log('attempting to install chrome extension');
                chrome.webstore.install(chromeUrl, function(){
                    console.log('Successfully installed Chrome Extension, reloading page');
                    window.location.reload();
                }, function(err){
                    console.error('Error installing extension in chrome', err);
                    console.error('Chrome webstore URL is', chromeUrl);
                });
            }

            if(respoke.needsFirefoxExtension && !respoke.hasFirefoxExtension) {
                console.log('attempting to install firefox extension');
                InstallTrigger.install({
                    Foo: {
                        URL: '/web-examples-respoke.xpi',
                        //IconURL: aEvent.target.getAttribute("iconURL"),
                        Hash: 'sha1:497e58f0ae0b9df8037c9925173f664a58de2580',
                        toString: function () {
                            return this.URL;
                        }
                    }
                });
            }

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
                    '#installExtension': {
                        'click': clickInstallExtension
                    },
                }
            });

            function removeInstructions(){
                if (respoke.hasScreenShare()) {
                    $el.find('.screen-share-instructions').remove();
                    return;
                }

                if (!respoke.needsChromeExtension || !respoke.hasChromeExtension) {
                    $el.find('#installChromeExtension').remove();
                }

                if (!respoke.needsFirefoxExtension || respoke.hasFirefoxExtension) {
                    $el.find('#installFirefoxExtension').remove();
                }

            }

            respoke.listen('extension-loaded', removeInstructions);

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
