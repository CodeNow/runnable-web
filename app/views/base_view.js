var RendrView = require('rendr/shared/base/view');
var Super = RendrView.prototype;
var _ = require('underscore');
var _str = require('underscore.string');
var utils = require('../utils');
var Image = require('../models/image');
var Container = require('../models/container');

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
  actionNamesToIgnore: ['stop propagation'],
  trackEvents: function () {
    var autoTrackEvents = this.autoTrackEvents;
    if (!isServer && this.events && autoTrackEvents) {
      var eventsToTrack = Array.isArray(autoTrackEvents) ?
        autoTrackEvents :
        Object.keys(this.events);
      eventsToTrack = _.difference(eventsToTrack, this.dontTrackEvents);
      eventsToTrack.forEach(function (eventStr) {
        var eventSplit, actionName, eventName, viewName, $el;
        eventSplit = eventStr.split(' ');
        actionName = this.events[eventStr];
        eventName = eventSplit[0];
        $el  = eventSplit[1] ? this.$(eventSplit[1]) : this.$el;
        $el.on(eventName, function (evt) {
          var properties = {}; //default
          if (eventName === 'submit') {
            properties = $(evt.currentTarget).serializeObject();
            delete properties.password;
          }
          this.trackEvent(actionName, properties);
        }.bind(this));
      }, this);
    }
  },
  trackEvent: function (actionName, properties, viewNameOverride) {
    actionName = _str.humanize(actionName);
    if (~this.actionNamesToIgnore.indexOf(actionName.toLowerCase())) {
      return;
    }
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
    if (this.model) {
      addModelProperties(properties, this.model);
    }
    else if (this.collection) {
      var collection = this.collection;
      var collectionName = (collection.constructor.id || collection.constructor.name).toLowerCase();
      properties[collectionName+'.params'] = JSON.stringify(collection.params);
      properties[collectionName+'.modelIds'] = collection.models.map(utils.pluck('id'));
    }
    addModelProperties(properties, this.app.user, 'app.');

    Track.event(viewNameOverride || this.viewName(), actionName, properties);
  },
  trackError: function (actionName, err) {
    if (err && err.message) {
      err = err.message;
    }
    actionName = _str.humanize(actionName);
    Track.event(this.viewName(), actionName +' Error:'+ err);
  },
  showMessage: function (str) {
    alertify.alert(str);
  },
  showError: function (err) {
    alertify.set({
      labels: {
        ok     : "Okay",
        cancel : "Cancel"
      }
    });
    if (err) {
      err = '<div class="red">'+err+'</div>';
      alertify.alert(err);
    }
  },
  showPrompt: function (self) {
    alertify.set({
      labels: {
        ok     : "Save and Publish",
        cancel : "Cancel"
      }
    });
    alertify.prompt('Give your project a unique name.',function(evt){
      if (evt) {
        // user selects primary action
        evt.preventDefault;
        // var formData = $('#alertify-text').serializeObject();
        // serializeObject() will not work with alertify forms
        var formData = {name:$('#alertify-text')[0].value};
        var options = utils.cbOpts(cb, self);
        self.model.save(formData,  options);
        function cb (err) {
          if (err) {
            self.showError(err);
          }
        }
      } else {
        // user selects cancel
      }
    });
  },
  showIfError: function (err) {
    if (err) this.showError(err);
  },
  disable: function (bool) {
    if (bool) {
      this.$el.attr('disabled', 'disabled');
    }
    else {
      this.$el.removeAttr('disabled');
    }
  },
  loading: function (bool) {
    if (utils.exists(bool)) {
      // SET
      if (bool) {
        this.$el.addClass('loading');
        // this.$el.addClass('overlay-loader');
      }
      else {
        this.$el.removeClass('loading');
        // this.$el.removeClass('overlay-loader');
      }
    }
    else {
      // GET
      return this.$el.hasClass('loading');
    }
  },
  viewName: function () {
    return _str.humanize(this.$el.attr('data-view'));
  },
  getTemplateData: function () {
    return this.options;
  },
  disableButtons: function (bool) {
    bool = utils.exists(bool) ? bool : this.$('button').attr('disabled');
    if (bool) {
      this.$('button').attr('disabled', 'disabled');
    }
    else {
      this.$('button').removeAttr('disabled');
    }
  }
});
