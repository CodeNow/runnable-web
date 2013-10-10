var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var ServiceModal = require('./service_modal');

module.exports = BaseView.extend({
  getTemplateData: function () {
    this.options.specification = this.collection.get(this.model.get('specification'));
    return this.options;
  },
  events: {
    'click [name=edit]'  : 'edit',
    'click [name=remove]': 'remove',
    'click [name=add]'   : 'add'
  },
  add: function () {
    var serviceModal = new ServiceModal({
      'app': this.app,
      'model': this.model,
      'collection': this.collection,
      'parent': this
    });
    serviceModal.open();
    return false; // stop link
  },
  edit: function () {
    var specification = this.collection.get(this.model.get('specification'));
    var serviceModal = new ServiceModal({
      'app': this.app,
      'model': this.model,
      'collection': this.collection,
      'parent': this
    });
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