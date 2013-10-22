var ModalView = require('./modal_view');
var ReviewSpecModal = require('./review_spec_modal');
var CreateSpecModal = require('./create_spec_modal');

module.exports = ModalView.extend({
  events: {
    'click .existing' : 'reviewSpec'
  },
  openReviewSpecModal: function () {
    (new ReviewSpecModal(this.options)).open();
  },
  openCreateSpecModal: function () {
    (new CreateSpecModal(this.options)).open();
  }
});

module.exports.id = "AddSpecModal";
