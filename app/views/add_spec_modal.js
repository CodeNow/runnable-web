var ModalView = require('./modal_view');
var ReviewSpecModal = require('./review_spec_modal');
var CreateSpecModal = require('./create_spec_modal');

module.exports = ModalView.extend({
  events: {
    'click .existing' : 'openReviewSpecModal',
    'click .new'      : 'openCreateSpecModal'
  },
  openReviewSpecModal: function (evt) {
    var specId = $(evt.currentTarget).data('id');
    var opts = this.options;
    opts.specification = opts.collection.get(specId);
    (new ReviewSpecModal(opts)).open();
    this.close();
  },
  openCreateSpecModal: function () {
    (new CreateSpecModal(this.options)).open();
    this.close();
  }
});

module.exports.id = "AddSpecModal";
