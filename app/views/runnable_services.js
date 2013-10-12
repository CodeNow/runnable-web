var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var ServiceModal = require('./service_modal');

module.exports = BaseView.extend({
  getTemplateData: function () {
    this.options.specification = this.collection.get(this.model.get('specification'));
    return this.options;
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:specification', this.render.bind(this));
  },
  events: {
    'click .edit-service'   : 'edit',
    'click .remove-service' : 'remove',
    'click [name=add]'      : 'add'
  },
  add: function (evt) {
    evt&&evt.preventDefault();
    var serviceModal = new ServiceModal(this.options); //model:container, collection:specifications
    serviceModal.open();
  },
  edit: function (evt) {
    evt&&evt.preventDefault();
    var serviceModal = new ServiceModal(this.options); //model:container, collection:specifications
    serviceModal.open();
  },
  remove: function () {
    this.model.set('specification', null);
    var options = utils.cbOpts(saveCallback.bind(this));
    this.model.save({}, options);
    function saveCallback (err, containerSaved) {
      if (err) {
        console.error(err);
      } else {
        this.render();
      }
    }
  }
});

module.exports.id = "RunnableServices";
