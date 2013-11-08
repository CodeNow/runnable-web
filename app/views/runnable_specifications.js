var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var AddSpecModal = require('./add_spec_modal');

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
    if (opts.specification) {
      this.listenTo(opts.specification, 'change', this.render.bind());
    }
  },
  events: {
    'click .edit-service'   : 'openEditSpecModal',
    'click .remove-service' : 'removeSpec',
    'click [name=add]'      : 'addSpec'
  },
  addSpec: function (evt) {
    evt&&evt.preventDefault();
    var opts = _.pick(this.options, 'model', 'collection', 'app');
    opts.nogoback = true;
    (new AddSpecModal(opts)).open(); //model:container, collection:specifications
  },
  openEditSpecModal: function () {
    var CreateSpecModal = require('./create_spec_modal');
    var opts = _.pick(this.options, 'app', 'model', 'collection');
    opts.editSpecification = this.options.specification;
    opts.nogoback = true;
    var modal = new CreateSpecModal(opts);
    if (modal.canEdit()) {
      modal.open()
    }
  },
  removeSpec: function () {
    this.model.set('specification', null);
    var options = utils.cbOpts(this.showIfError.bind(this));
    this.model.save({}, options);
  }
});

module.exports.id = "RunnableSpecifications";
