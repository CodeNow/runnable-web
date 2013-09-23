var ModalView = require('./modal_view');

module.exports = ModalView.extend({
  postRender: function () {
    var formView = _.findWhere(this.childViews, {name:'contact_form'});
    this.listenTo(formView, 'submitted', function (err) {
      if (!err) {
        this.stopListeningTo(formView)
        this.close();
      }
    }.bind(this));
  }
});

module.exports.id = "ContactModal";
