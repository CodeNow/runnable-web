var ModalView = require('./modal_view');
var Super = ModalView.prototype;
var utils = require('../utils');
var _ = require('underscore');
var Specification = require('../models/specification');
var marked = require('marked');

marked.setOptions({
  sanitize: true
});

module.exports = ModalView.extend({
  id: 'service-modal',
  className: 'fade',
  events: {
    'click button.prev' : 'prev',
    'click button.next' : 'next',
    'click .step-progress-bar > li.active' : 'gotoStep'
    // all events in events1, events2, events3
  },
  postInitialize: function () {
    this.options.step = 1;
    this.options.previewInstructions = false;
    _.extend(this.events, this.events1, this.events2, this.events3);
  },
  getTemplateData: function () {
    var opts = this.options;
    var spec = opts.specification = opts.specification ||
      this.collection.get(this.model.get('specification')) || {};
    if (spec.attributes) opts.rendered = marked(opts.specification.get('instructions') || '');
    opts.header = this['header'+opts.step];
    return opts;
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
    var stepPostRender = this['postRender'+this.options.step];
    if (stepPostRender) stepPostRender.call(this);
  },
  gotoStep: function (evt) {
    var step = (typeof evt == 'number') ? evt : parseInt($(evt.currentTarget).data('step'));
    this.options.step = step;
    this.render();
  },
  prev: function (evt) {
    if (evt) evt.preventDefault();
    this.options.step--;
    this.render();
  },
  next: function (evt) {
    if (evt) evt.preventDefault();
    this.options.step++;
    this.render();
  },

  /*
    STEP 1
   */
  header1: 'Step 1: Service',
  events1: {
    'change .specification' : 'changeService',
    'submit form.step1'     : 'submitStep1ForNew'
  },
  changeService: function (evt) {
    var app = this.app;
    var opts = this.options;
    var specId = $(evt.currentTarget).val();
    var currentSpec = opts.specification;

    if (specId === '') {
      opts.specification = {};
    }
    else if (specId === currentSpec.id) {
      return; // do nothing
    }
    else if (specId === 'new') {
      opts.specification = new Specification({}, {app:app});
    }
    else {
      opts.specification = new Specification(this.collection.get(specId).toJSON(), {app:app});
    }
    this.render();
  },
  submitStep1ForNew: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    var specification = this.options.specification;
    specification.set(formData);
    this.next();
  },

  /*
    STEP 2
   */
  header2: 'Step 2: Service Keys',
  events2: {
    'submit .add-key-form': 'addKey',
    'click .remove-key'   : 'removeKey',
    'submit form.step2'   : 'submitStep2ForNew',
    'mouseover .keys-popover': 'showKeysHint',
    'mouseout .keys-popover' : 'hideKeysHint'
  },
  postRender2: function () {
    this.$('.keys-popover').popover({
      content: 'Required variables the user must set to run your example. Use these keys as environment variables in your example. Eg. APP_SECRET, AUTH_TOKEN.',
      show: false
    });
    this.$('input[name=new-key]').keydown(function (evt) {
      evt.stopPropagation();
      if (evt.keycode === 13) {
        this.addKey();
      }
    }.bind(this));
  },
  showKeysHint: function (evt) {
    $(evt.currentTarget).popover('show');
  },
  hideKeysHint: function (evt) {
    $(evt.currentTarget).popover('hide');
  },
  addKey: function (evt) {
    evt.preventDefault();
    var $input = this.$('input[name=new-key]');
    var key = $input.val();
    if (key.trim().length === 0) return;
    if (~key.indexOf(' ')) {
      this.showError('Key cannot contain spaces (Ex: API_KEY)');
      return;
    }
    var specAttrs = this.options.specification.attributes;
    var reqs = specAttrs.requirements = specAttrs.requirements || [];
    $input.val('');
    if (~reqs.indexOf(key)) return;
    reqs.push(key);
    this.render();
    this.$('input[name=new-key]').focus();
  },
  removeKey: function (evt) {
    var key = $(evt.currentTarget).parent('.form-group').find('input').val();
    var reqs = this.options.specification.attributes.requirements;
    reqs.splice(reqs.indexOf(key), 1);
    this.render();
  },
  submitStep2ForNew: function (evt) {
    evt.preventDefault();
    var $keyInputs = this.$('input:disabled');
    var keys = [].slice.call($keyInputs).map(utils.pluck('value'));
    if (keys.length === 0) {
      return this.showError('Atleast one key is required');
    }
    this.options.specification.set({
      requirements: keys
    });
    this.next();
  },

  /*
    STEP 3
   */
  header3: 'Step 3: Service Instructions for Users',
  events3: {
    'submit form.step3'            : 'submitStep3ForNew',
    'click .add-service'           : 'addService',
    'keydown .instructions'        : 'saveInstructions',
    'change .instructions'         : 'saveInstructions',
    'click .nav > li:not(.active)' : 'togglePreviewInstructions'
  },
  saveInstructions: function (evt) {
    var instructions = $(evt.currentTarget).val();
    this.options.specification.set('instructions', instructions);
  },
  submitStep3ForNew: function (evt) {
    evt.preventDefault();
    this.disableButtons(true);
    var spec = this.options.specification;
    var instructions = spec.get('instructions');
    if (instructions.trim().length === 0) {
      return this.showError('Service Instructions are Required');
    }
    var doneCount = 0;
    var opts = utils.cbOpts(callback, this);
    if (spec.isNew()) {
      spec.save({}, opts);
    }
    else {
      var specEditing = this.collection.get(spec.id);
      if (specEditing) {
        specEditing.save(spec.toJSON(), opts); // save back to model that is in the collection
      }
      else {
        callback();
      }
    }
    function callback (err) {
      if (err) {
        this.disableButtons(false);
        this.showError(err);
      }
      else {
        this.addService();
      }
    }
  },
  addService: function () {
    this.disableButtons(true);
    var container = this.model;
    var spec = this.options.specification;
    var opts = utils.cbOpts(callback, this);
    opts.put = true;
    // assume success
    this.collection.add(spec);
    container.save({ specification:spec.id }, opts);
    function callback (err) {
      if (err) {
        this.collection.remove(spec); // revert on fail
        this.disableButtons(false);
        this.showError(err);
      }
      else {
        this.close();
      }
    }
  },
  togglePreviewInstructions: function (evt) {
    evt.preventDefault();
    this.options.previewInstructions = !this.options.previewInstructions;
    this.render();
  }
});

module.exports.id = "ServiceModal";