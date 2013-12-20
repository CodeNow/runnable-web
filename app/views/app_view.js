var BaseAppView = require('rendr/shared/base/app_view');
var Super = BaseAppView.prototype;
var _str = require('underscore.string');
var utils = require('../utils');

var $body = $('body');

module.exports = BaseAppView.extend({
  postInitialize: function() {
    this.app.on('change:loading', function(app, loading) {
      $body.toggleClass('loading', loading);
    }, this);
  },
  _interceptClick: function(e) {
    var properties = {}
    var $el;
    if (e.currentTarget) {
      $el = $(e.currentTarget);
      properties.href =  $el.attr('href');
      properties.label = $el.html();
    }
    this.trackEvent('Click Link', properties, 'App');
    Super._interceptClick.apply(this, arguments);
  },
  trackEvent: function (actionName, properties, viewNameOverride) {
    actionName = _str.humanize(actionName);
    properties = properties || {};
    function addModelProperties(properties, model, prependKey) {
      prependKey = prependKey || '';
      var modelName = (model.constructor.id || model.constructor.name).toLowerCase();
      var json = model.toJSON();
      for (var key in json) {
        var value = json[key];
        var type = typeof value;
        if (type === 'object') value = JSON.stringify(value);
        properties[prependKey+modelName+'.'+key] = value;
      }
    }
    addModelProperties(properties, this.app.user, 'app.');

    Track.event(viewNameOverride || this.viewName(), actionName, properties);
  },
});
