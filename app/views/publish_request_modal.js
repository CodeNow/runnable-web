var ModalView = require('./modal_view');

module.exports = ModalView.extend({
  id: 'publish-request-modal',
  postRender: function () {
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
