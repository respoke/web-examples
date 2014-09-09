define([
    'jquery-core',
    'backbone'
], function ($, Backbone) {
    $.Model = Backbone.Model;
    $.Collection = Backbone.Collection;
    $.Router = Backbone.Router;
    $.history = Backbone.history;
    $.sync = Backbone.sync;
    $.View = Backbone.View;
    return $;
});