var _ = require('underscore');
var BaseView = require('./base_view');
var Image = require('../models/image');
var utils = require('../utils');

module.exports = BaseView.extend({
  events: {
    'click #pubwarn-new-button' : 'publishNew',
    'click #pubwarn-back-button': 'publishBack'
  },
  postHydrate: function () {
    // rerender on login/logout
    this.listenTo(this.app.user, 'change:permission_level', this.render.bind(this));
  },
  preRender: function () {
    var show = this.options.show = this.app.user.isVerified();
    this.className = show ? 'status-bar' : 'display-none';
  },
  getTemplateData: function () {
    this.options.user = this.app.user;
    return this.options;
  },
  postRender: function () {
    this.$pubNew = $('#pubwarn-new-button');
    this.$pubBack = $('#pubwarn-back-button');
  },
  publishNew: function () {
    this.$pubNew.attr('disabled', 'disabled');
    var image = new Image({}, {app:this.app});
    image.publishFromContainer(this.options.containerid, this.publishCallback.bind(this));
  },
  publishBack: function () {
    this.$pubBack.attr('disabled', 'disabled');
    if (!this.app.user.canEdit(this.model)) { // this shouldn't ever happen..
      this.showError('You cannot publish back since you are not the owner of the original runnable');
      return;
    }
    // this.model is container's parent image;
    this.model.publishFromContainer(this.options.containerid, this.publishCallback.bind(this));
  },
  publishCallback: function (err, image) {
    if (err) {
      this.$pubNew.removeAttr('disabled');
      this.$pubBack.removeAttr('disabled');
      this.showError(err);
    }
    else {
      // could do backbone pushstate too... just dont know how from a rendr view..
      this.app.router.navigate('/'+image.id, true);
    }
  }
});

module.exports.id = 'PublishWarning';
