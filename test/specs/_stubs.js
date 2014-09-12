var respoke = {
    createClient: function (options) {
        options.connect = function (obj) {
            $.extend(options, {
                getEndpoint: function () {}
            }, obj);
            return {
                done: function (fn) {
                    fn();
                }
            }
        };
        return options;
    }
};