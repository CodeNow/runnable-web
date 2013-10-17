var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var ServiceModal = require('./service_modal');

module.exports = BaseView.extend({
  className: 'services-body',
  getTemplateData: function () {
    // rerenders break the context pass-thru :(
    this.options.context = this.options.context || {
      implementations: this.app.fetcher.collectionStore.get('implementations', {}, true)
    };
    //backend and always
    this.options.specification = this.collection.get(this.model.get('specification'));
    return this.options;
  },
  postHydrate: function () {
    window.container1 = this.model;
    this.listenTo(this.model, 'change:specification', this.onChangeSpecification.bind(this));
    //frontend
    this.setSpecification();
  },
  onChangeSpecification: function () {
    this.setSpecification();
    this.render();
  },
  setSpecification: function () {
    var opts = this.options;
    if (opts.specification) {
      this.stopListening(opts.specification);
    }
    opts.specification = this.collection.get(this.model.get('specification'));
    this.listenTo(opts.specification, 'change', this.render.bind());
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
    debugger;
    this.model.set('specification', null);
    var options = utils.cbOpts(this.showIfError.bind(this));
    this.model.save({}, options);
  }
});

module.exports.id = "RunnableServices";
