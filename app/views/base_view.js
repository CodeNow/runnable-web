var RendrView = require('rendr/shared/base/view');
var Super = RendrView.prototype;
var _ = require('underscore');
var _str = require('underscore.string');

// Create a base view, for adding common extensions to our
// application's views.
module.exports = RendrView.extend({
  _postRender: function() {
    this.attachChildViews();
    this.postRender();
    this.trackEvents(); // added track events
    this.trigger('postRender');
  },
  autoTrackEvents: true,
  trackEvents: function () {
    if (!isServer && this.events && this.autoTrackEvents) {
      for (var eventStr in this.events) {
        (function (eventStr) {
          var eventSplit, actionName, eventName, viewName, $el;
          eventSplit = eventStr.split(' ');
          actionName = this.events[eventStr];
          eventName = eventSplit[0];
          $el  = eventSplit[1] ? this.$(eventSplit[1]) : this.$el;
          $el.on(eventName, function (evt) {
            var properties = {}; //default
            if (eventName === 'submit') {
              properties = $(evt.currentTarget).serializeData();
            }
            this.trackEvent(actionName, properties);
          }.bind(this));
        }).call(this, eventStr);
      }
    }
  },
  trackEvent: function (actionName, properties) {
    actionName = _str.humanize(actionName);
    properties = properties || {};
    if (this.model) {
      var model = this.model;
      var modelName = model.constructor.id || model.constructor.name;
      properties = _.extend(properties, {
        dataType: modelName,
        dataName: model.get('name'),
        dataId  : model.id
      });
    }
    else if (this.collection) {
      var collection = this.collection;
      var collectionName = collection.constructor.id || collection.constructor.name;
      properties = _.extend(properties, {
        dataType: collectionName,
        dataName: JSON.stringify(collection.params)
      });
    }
    Track.event(this.viewName(), actionName, properties);
  },
  trackError: function (actionName, err) {
    if (err && err.message) {
      err = err.message;
    }
    actionName = _str.humanize(actionName);
    Track.event(this.viewName(), actionName +' Error:'+ err);
  },
  showError: function (err) {
    alert(err);
  },
  disable: function (bool) {
    if (bool) {
      this.$el.attr('disabled', 'disabled');
    }
    else {
      this.$el.removeAttr('disabled');
    }
  },
  viewName: function () {
    return _str.humanize(this.$el.attr('data-view'));
  },
  getTemplateData: function () {
    return this.options;
  }
});
