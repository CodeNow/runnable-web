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
      self.$pubNew.removeAttr('disabled');
      self.$pubBack.removeAttr('disabled');

      if (err === 'a shared runnable by that name already exists') {
        var actionHandler = function(dialogItself){
          var formValidity = dialogItself.$modalContent[0].checkValidity();

          if (formValidity && err === 'a shared runnable by that name already exists') {
            dialogItself.$modalBody
              .find('.alert')
              .remove()
              .end()
              .append('<div class="alert alert-warning"><strong>That name is taken!</strong> Try something else.</div>');
          } else if (formValidity) {
            self.publishNew();
            dialogItself.close();
          }
        };

        self.showPrompt({
          message:
            '<p>Choose a unique name for your project.<br><strong>'+self.model.get('name')+'</strong> already exists.'+
            '<input type="text" class="form-control" name="name" required>',
          actionLabel: 'Save and Publish',
          actionHandler: actionHandler
        });
      } else if (err) {
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
