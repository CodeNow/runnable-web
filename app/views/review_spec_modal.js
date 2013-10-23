var ModalView = require('./modal_view');
var utils = require('../utils');
var _ = require('underscore');

module.exports = ModalView.extend({
  events: {
      'click .edit' : 'openEditSpecModal',
      'click .back' : 'openAddSpecModal',
      'click .done' : 'saveSpecificationToContainer'
  },
  openEditSpecModal: function () {
    // display error if cant or something
  },
  openSelectSpecModal: function () {

  },
  saveSpecificationToContainer: function () {
    var opts = utils.cbOpts(this.saveContainerCallback, this);
    var specId = this.options.specification.id;
    this.model.save({specification:specId}, opts);
  },
  saveContainerCallback: function (err) {
    if (err) {
      this.showError(err);
    }
    else {
      this.close();
    }
  },
  openAddSpecModal: function () {
    var AddSpecModal = require('./add_spec_modal');
    var opts = _.pick(this.options, 'app', 'model', 'collection');
    (new AddSpecModal(opts)).open();
    this.close();
  }
});

module.exports.id = "ReviewSpecModal";
