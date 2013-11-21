var _ = require('underscore');
var BaseView = require('./base_view');
var utils = require('../utils');
var PublishRequestModal = require('./publish_request_modal');

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
    this.publishLoader = _.findWhere(this.childViews, {name:'publish_loader'});
    this.publishLoader.initLoading('new', this.pushblishCallback.bind(this));
    this.$pubNew.attr('disabled', 'disabled');
  },
  publishBack: function () {
    this.publishLoader = _.findWhere(this.childViews, {name:'publish_loader'});
    this.publishLoader.initLoading('back', this.pushblishCallback.bind(this));
    this.$pubBack.attr('disabled', 'disabled');
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
