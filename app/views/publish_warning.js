var _ = require('underscore');
var BaseView = require('./base_view');
var Image = require('../models/image');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  className: 'notification warning',
  events: {
    'click #pubwarn-new-button' : 'publishNew',
    'click #pubwarn-back-button': 'publishBack'
  },
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      user: this.app.user
    });
  },
  publishNew: function () {
    var image = new Image({}, {app:this.app});
    image.publishFromContainer(this.options.containerid, this.publishCallback.bind(this));
  },
  publishBack: function () {
    if (!this.app.user.isOwnerOf(this.model)) { // this shouldn't ever happen..
      this.showError('You cannot publish back since you are not the owner of the original runnable');
      return;
    }
    // this.model is container's parent image
    debugger;
    this.model.publishFromContainer(this.options.containerid, publishCallback.bind(this));
    function publishCallback (err, image) {
      if (err) {
        this.showError(err);
      }
      else {
        debugger;
        // could do backbone pushstate too... just dont know how from a rendr view..
        window.location.href = '/'+image.id;
      }
    }
  }
});

module.exports.id = 'PublishWarning';
