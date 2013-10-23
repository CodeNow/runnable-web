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
    'click .back'        : 'openAddSpecModal',
    'click .prev'        : 'step1'
  },
  dontTrackEvents: ['submit .name-form'],
  postInitialize: function () {
    var opts = this.options;
    opts.step = 1;
    this.uuid = utils.uuid();
    var existingData = opts.editSpecification && opts.editSpecification.toJSON();
    if (existingData) { // editing existing
      opts.header = "Edit API";
      opts.saveButtonText = "Save";
      if (this.model.get('specification') != existingData._id) {
        opts.saveButtonText = "Save and Add";
      }
      opts.specification = new Specification(existingData, {app:this.app});
    }
    else { // creating new
      opts.header = "Create API";
      opts.saveButtonText = "Create and Add";
      opts.specification = new Specification({_id:this.uuid}, {app:this.app});
    }
    opts.specification.store(); // id and store, so subview can use it as a model
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
    if (data.requirements.some(hasSpace)) {
      this.showError('API Key Names Cannot have Spaces<br>(bc they are set as environment variables on the VM)');
      return;
    }
    if (_.unique(data.requirements).length !== data.requirements.length) {
      this.showError('API Keys must be Unique (No Duplicates)');
      return;
    }
    spec.set(data);
    this.step2();
    function hasSpace (str) {
      return ~str.indexOf(' ');
    }
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
    evt.preventDefault();
    evt.stopPropagation();
    var spec = this.options.specification;
    var formData = $(evt.currentTarget).serializeObject();
    spec.set(formData);
    var data = this.options.specification.toJSON();
    var saveOpts = utils.cbOpts(this.saveSpecCallback, this);
    this.disableButtons(true);
    if (this.options.editSpecification) { //editing
      this.options.editSpecification.save(data, saveOpts);
    }
    else { //creating
      this.collection.add(spec); // assume success
      spec.unset('_id')
      spec.save(data, saveOpts);
    }
  },
  saveSpecCallback: function (err) {
    var spec = this.options.specification;
    if (err) {
      this.showError(err);
      this.disableButtons(false);
      if (!this.options.editSpecification) { //create, not edit
        this.collection.remove(spec);
      }
    }
    else {
      this.saveContainer();
    }
  },
  saveContainer: function () {
    var container = this.model;
    var saveOpts = utils.cbOpts(this.saveContainerCallback, this);
    saveOpts.patch = true;
    var specId = (this.options.editSpecification) ?
      this.options.editSpecification.id : //editing
      this.options.specification.id; //creating
    container.save({specification:specId}, saveOpts);
  },
  saveContainerCallback: function (err, container) {
    if (err) {
      this.showError(err);
      this.disableButtons(false);
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
  },
  openAddSpecModal: function () {
    var AddSpecModal = require('./add_spec_modal');
    var opts = _.pick(this.options, 'app', 'model', 'collection');
    (new AddSpecModal(opts)).open();
    this.close();
  },
  canEdit: function () {
    var spec = this.options.editSpecification;
    if (spec.get('inUseByNonOwner')) {
      this.showError("Sorry you cannot edit this specification, because<br> it is in use by other user's runnables.")
      return false;
    }
    else {
      return true;
    }
  }
});

module.exports.id = "CreateSpecModal";
