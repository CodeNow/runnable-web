var BaseView = require('./base_view');
var PublishRequestModal = require('./publish_request_modal');
var RegisterModal = require('./modals/register_modal');

module.exports = BaseView.extend({
  id: 'header-actions',
  className: 'col-sm-4',
  events: {
    'click #header-signup-link' : 'openSignup'
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:username', this.render.bind(this));
  },
  openSignup: function (evt) {
    evt.preventDefault();
    var registerModal = new RegisterModal({ app:this.app });
    registerModal.open();
  },
  openSignupNew: function (evt) {
    var registerModal = new RegisterModal({app: this.app});
    registerModal.open();
  }
});

module.exports.id = "HeaderActions";
