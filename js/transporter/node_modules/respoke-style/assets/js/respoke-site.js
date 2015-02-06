//
// Syntax highlighting http://highlightjs.org/usage/
//
hljs.configure({classPrefix: 'hljs-'});
hljs.initHighlightingOnLoad(['javascript','css','html','json','bash']);

/* see base.scss - these should remain in sync */
window.breakpoints = {
    small: 550,
    medium: 700,
    large: 1332,
    current: ''
};

$(function jqOnReady() {

    // Setup dynamic links
    var token = $.cookie('token');
    var $login = $('.login');
    var $signup = $('.signup');
    var $wwwlink = $('.www-link');

    var apiBase = window.location.host.replace('docs', 'api').replace(':2002', ':2000');
    var apiUrl = apiBase.indexOf('testing.digiumlabs.com') !== -1 ? 'http://' : 'https://';
    apiUrl += apiBase + '/v1/admins/me';
    var publicBase = window.location.host.replace('docs', 'www').replace(':2002', ':2001');
    var publicUrl = publicBase.indexOf('testing.digiumlabs.com') !== -1 ? 'http://' : 'https://';
    publicUrl += publicBase;
    var portalBase = window.location.host.replace('docs', 'portal').replace(':2002', ':2003');
    var portalUrl = portalBase.indexOf('testing.digiumlabs.com') !== -1 ? 'http://' : 'https://';
    portalUrl += portalBase;

    if (token) {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            headers: {
                'Admin-Token': token
            },
            success: function () {
                $signup.attr('href', portalUrl);
                $signup.text('Portal');
                $login.click(logout);
                $login.text('log out');
            }
        });
    }
    $login.attr('href', portalUrl + '/#/login');
    $signup.attr('href', publicUrl + $signup.attr('href'));
    $wwwlink.each(function () {
        $(this).attr('href', publicUrl + $(this).attr('href'))
    });


    // Handlers
    function getCurrentBreakpoint() {
        var $width = $(window).width();
        var $breakpoints = window.breakpoints;
        var current = 'large';
        if ($width < $breakpoints.small) {
            current = 'small';
        } else if ($width < $breakpoints.medium) {
            current = 'medium';
        }
        return current;
    }
    window.breakpoints.current = getCurrentBreakpoint();
    $(window).on('resize', function (e) {
        var curr = getCurrentBreakpoint();
        if (curr !== window.breakpoints.current) {
            window.breakpoints.current = curr;
            resetNavState();
        }
    });
    $('.navbar a.toggler').click(toggleMainMenu);
    $('.breadcrumbs .toggler-sec').click(toggleSecondaryNav);


    // Payboard
    $.ajax({
        url: 'https://d3px1qgagsf6ei.cloudfront.net/Scripts/f772acdb-7c45-430c-8c5a-28c3bcbb420e',
        crossDomain: true,
        dataType: 'script',
        success: function () {
            Payboard.Events.trackPage;
        },
        error: function () {
            console.warn("There was an error retrieving the payboard tracking script");
        }
    });
});


function logout(e) {
    e && e.preventDefault();
    $.removeCookie('token', { domain: '.' + window.location.hostname.split('.').slice(-2).join('.') });
    window.location.reload();
}

function toggleMainMenu(e) {
    e && e.preventDefault();

    $('.navbar .nav-links')
    .each(function () {
        this.style.display = !this.style.display || this.style.display === 'none' ? 'inline-block' : 'none';
    });
}

function toggleSecondaryNav(e) {
    e && e.preventDefault();
    $('.sidebar').toggle();
    $('.breadcrumbs').toggleClass('open-state');
    $('.breadcrumbs .links').toggle();
}

function resetNavState() {
    $('.sidebar, .navbar .nav-links').css('display', '');
    $('.breadcrumbs').removeClass('open-state');
}
