'use strict';

var path = require('path');
var bourbon = require('node-bourbon');

var basePath = __dirname;

var paths = {
    assets: path.resolve(basePath, 'assets'),
    images: path.resolve(basePath, 'assets', 'images'),
    scripts: path.resolve(basePath, 'assets', 'js'),
    styles: path.resolve(basePath, 'styles'),
    templates: path.resolve(basePath, 'templates')
};

var RespokeStyle = {
  paths: paths,
    bourbon: bourbon,
    includeStylePaths: function includeStylePaths(myPaths, noBourbonPaths) {
        var allPaths = myPaths || [];

        if (!noBourbonPaths) {
            allPaths = bourbon.with(paths);
        }

        allPaths.push(paths.styles);

        return allPaths;
    }
};

module.exports = RespokeStyle;
