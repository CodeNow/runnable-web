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
    this.publishLoader.initLoading('new', this.publishCallback.bind(this));
    this.$pubNew.attr('disabled', 'disabled');
  },
  publishBack: function () {
    this.publishLoader = _.findWhere(this.childViews, {name:'publish_loader'});
    this.publishLoader.initLoading('back', this.publishCallback.bind(this));
    this.$pubBack.attr('disabled', 'disabled');
  },
  openPublishRequest: function (evt) {
    evt.preventDefault();
    var publishRequestModal = new PublishRequestModal({app:this.app});
    publishRequestModal.open();
  },
  publishCallback: function (err, image) {
    if (err) {
      var self = this;

      self.app.set('loading', false);
      this.$pubNew.removeAttr('disabled');
      this.$pubBack.removeAttr('disabled');

      if (err === "a shared runnable by that name already exists") {
        alertify.prompt('Give your project a unique name.',function(e,err){
          if (e) {
            debugger;
            e.preventDefault;
            var formData = $('#alertify-text').serializeObject();
            var options = utils.cbOpts(cb, self);
            self.model.save(formData,  options);
            function cb (err) {
              if (err) {
                self.showError(err);
              }
            }
          } else {
            //cancel
          }
        });
      } else {
        self.showError(err);
      }
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
