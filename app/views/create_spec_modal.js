var ModalView = require('./modal_view');
var Super = ModalView.prototype;
var _ = require('underscore');
var utils = require('../utils');
var Specification = require('../models/specification');

module.exports = ModalView.extend({
  events: {
    'submit .name-form'  : 'saveStep1',
    'submit .keys-form'  : 'addKey',
    'click  button.next' : 'saveStep1',
    'submit .step2'      : 'saveSpec',
    'click  button.prev' : 'step1',
    'change textarea': 'onEditInstructions',
    'keyup textarea' : 'onEditInstructions',
    'paste textarea' : 'onEditInstructions'
  },
  dontTrackEvents: ['submit .name-form'],
  postInitialize: function () {
    this.options.step = 1;
    this.options.specification = new Specification({_id:utils.uuid()}, {app:this.app});
    this.options.specification.store(); // id and store, so subview can use it as a model
  },
  preRender: function () {
    Super.preRender.apply(this, arguments);
    var name = this.$('[name=name]').val();
    if (name) {
      this.options.specification.set({name: name.trim()});
    }
  },
  // STEP1
  step1: function () {
    this.options.step = 1;
    this.render();
  },

  saveStep1: function (evt) {
    var spec = this.options.specification;
    var data = {};
    evt.stopPropagation();
    evt.preventDefault();
    data.name = this.$('[name=name]').val().trim();
    data.requirements = spec.get('requirements') || [];
    if (!data.name) {
      this.showError('API Name is Required');
      return;
    }
    if (data.requirements.length === 0) {
      this.showError('Atleast one API Key is Required');
      return;
    }
    spec.set(data);
    this.step2();
  },
  // STEP2
  step2: function () {
    this.options.step = 2;
    this.render();
  },
  onEditInstructions: function () {
    debugger;
    var spec = this.options.specification;
    this.$('.preview').html(
      spec.renderedInstructions()
    );
  },
  saveSpec: function () {
    var data = $(evt.currentTarget).serializeObject();
    var spec = this.options.specification;
    var data = this.options.specification.toJSON();
    var opts = utils.cbOpts(this.saveSpecCallback, this);
    spec.save(data, opts);
  },
  saveSpecCallback: function (err, spec) {
    if (err) {
      this.showError(err);
    }
    else {
      this.saveSpecToContainer();
    }
  },
  saveContainer: function () {
    var container = this.model;
    var opts = utils.cbOpts(this.saveContainerCallback, this);
    container.save(opts)
  },
  saveContainerCallback: function (err, container) {
    if (err) {
      this.showError(err);
    }
    else {
      this.close();
    }
  },
  preventDefault: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
});

module.exports.id = "CreateSpecModal";
