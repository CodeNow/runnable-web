var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'publish-request-modal',
  postRender: function () {
    Super.postRender.apply(this, arguments);
    var formView = _.findWhere(this.childViews, {name:'publish_request_form'});
    this.listenTo(formView, 'submitted', function (err) {
      if (!err) {
        this.stopListeningTo(formView)
        this.close();
      }
    }.bind(this));
  }
});

module.exports.id = "PublishRequestModal";
