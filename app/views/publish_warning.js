var _ = require('underscore');
var BaseView = require('./base_view');
var Image = require('../models/image');
var utils = require('../utils');
var PublishRequestModal = require('./publish_request_modal');
var PublishLoader = require('./publish_loader');

module.exports = BaseView.extend({
  events: {
    'click #pubwarn-new-button' : 'publishNew',
    'click #pubwarn-back-button': 'publishBack',
    'click #pubwarn-request-button' : 'openPublishRequest'
  },
  className: 'status-bar',
  postHydrate: function () {
    // rerender on login/logout
    this.listenTo(this.app.user, 'change:permission_level', this.render.bind(this));
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

    //test
    this.testLoader();
    return;

    this.app.set('loading', true);
    var publishLoader = new PublishLoader({app:this.app});
    var image = new Image({}, {app:this.app});
    image.publishFromContainer(this.options.containerid, this.publishCallback.bind(this));
  },
  publishBack: function () {
    this.$pubBack.attr('disabled', 'disabled');

    //test
    this.testLoader();
    return;
    
    this.app.set('loading', true);
    if (!this.app.user.canEdit(this.model)) { // this shouldn't ever happen..
      this.showError('You cannot publish back since you are not the owner of the original runnable');
      return;
    }
    // this.model is container's parent image;
    this.model.publishFromContainer(this.options.containerid, this.publishCallback.bind(this));
  },
  openPublishRequest: function (evt) {
    evt.preventDefault();
    var publishRequestModal = new PublishRequestModal({app:this.app});
    publishRequestModal.open();
  },
  publishCallback: function (err, image) {
    if (err) {
      this.app.set('loading', false);
      this.$pubNew.removeAttr('disabled');
      this.$pubBack.removeAttr('disabled');
      this.showError(err);
    }
    else {
      // could do backbone pushstate too... just dont know how from a rendr view..
      this.app.router.navigate('/'+image.id, true);
    }
  },
  testLoader: function(){
    $('#page-loader').hide();
    $('#publish-loader').show();
  }
});

module.exports.id = 'PublishWarning';
