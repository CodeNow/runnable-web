var ModalView = require('./modal_view');
var Super = ModalView.prototype;
var _ = require('underscore');
var utils = require('../utils');
var Specification = require('../models/specification');

module.exports = ModalView.extend({
  events: {
    'submit .step1'      : 'saveStep1',
    'submit .step2'      : 'saveSpec',
    'click  button.prev' : 'step1',
    'click .nav-tabs a'  : 'clickTab',
  },
  dontTrackEvents: ['submit .name-form'],
  postInitialize: function () {
    this.options.step = 1;
    this.uuid = utils.uuid();
    this.options.specification = new Specification({_id:this.uuid}, {app:this.app});
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
  saveStep1: function (evt) {
    var spec = this.options.specification;
    var data = {};
    evt.stopPropagation();
    evt.preventDefault();
    data.name = this.$('[name=name]').val().trim();
    data.requirements = _(this.$('[name=requirement]'))
      .map(function (reqInput) {
        var $requirement = $(reqInput);
        var val = $requirement.val() || '';
        return val && val.trim();
      })
      .filter(function (req) {
        return req !== '';
      });
    if (!data.name) {
      this.showError('API Name is Required');
      return;
    }
    if (data.requirements.length === 0) {
      this.showError('Atleast one API Key is Required');
      return;
    }
    if (_.unique(data.requirements).length !== data.requirements.length) {
      this.showError('API Keys must be Unique (No Duplicates)');
      return;
    }
    spec.set(data);
    this.step2();
  },
  step2: function () {
    this.options.step = 2;
    this.render();
  },
  // STEP2
  clickTab: function (evt) {
    evt.preventDefault();
    var opts = this.options;
    var instructions = this.$('[name=instructions]').val();
    opts.specification.set('instructions', instructions);
    this.$('#create-spec-preview').html(
      opts.specification.renderedInstructions()
    );
    var $a = this.$(evt.currentTarget);
    $a.tab('show');
  },
  saveSpec: function (evt) {
    debugger;
    evt.preventDefault();
    evt.stopPropagation();
    var data = $(evt.currentTarget).serializeObject();
    var spec = this.options.specification;
    spec.unset('_id')
    var data = this.options.specification.toJSON();
    var opts = utils.cbOpts(this.saveSpecCallback, this);
    spec.save(data, opts);
  },
  saveSpecCallback: function (err, spec) {
    if (err) {
      this.showError(err);
    }
    else {
      this.saveContainer();
    }
  },
  saveContainer: function () {
    var container = this.model;
    var opts = utils.cbOpts(this.saveContainerCallback, this);
    opts.patch = true;
    var specId = this.options.specification.id;
    container.save({specification:specId}, opts);
  },
  saveContainerCallback: function (err, container) {
    if (err) {
      this.showError(err);
    }
    else {
      this.close();
    }
  },
  step1: function () {
    var spec = this.options.specification;
    if (!this.options.specification.id) {
      spec.set('_id', this.uuid); // allows subviews to use spec as a model, stupid rendr
    }
    this.options.step = 1;
    this.render();
  }
});

module.exports.id = "CreateSpecModal";
