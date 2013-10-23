var ModalView = require('./modal_view');
var utils = require('../utils');

module.exports = ModalView.extend({
  events: {
      'click .edit' : 'openEditSpecModal',
      'click .back' : 'openSelectSpecModal',
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
  }
});

module.exports.id = "ReviewSpecModal";
