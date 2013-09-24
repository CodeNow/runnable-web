var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  postRender: function () {
    Super.postRender.apply(this, arguments);
    var formView = _.findWhere(this.childViews, {name:'contact_form'});
    this.listenTo(formView, 'submitted', function (err) {
      if (!err) {
        this.stopListening(formView)
        this.close();
      }
    }.bind(this));
  }
});

module.exports.id = "ContactModal";
