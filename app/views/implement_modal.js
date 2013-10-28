var ModalView = require('./modal_view');
var Super = ModalView.prototype;
var utils = require('../utils');
var _ = require('underscore');
var Implementation = require('../models/implementation');
var marked = require('marked');
var uuid = require('node-uuid');

marked.setOptions({
  sanitize: true
});

module.exports = ModalView.extend({
  id: 'implement-modal',
  events: {
    'submit form'     : 'submit',
    'click .nav li a' : 'switchTab',
    'click input[readonly]' : 'baseUrl',
    'mouseover .url-popover' : 'showHint',
    'mouseout .url-popover'  : 'hideHint',
    'mouseover .keys-popover': 'showHint',
    'mouseout .keys-popover' : 'hideHint',
    'click .run-button'      : 'run'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
    this.$('.url-popover').popover({
      content: 'Use this as the base for a callback URL or redirect URL. This can be used as the permanent url of this application.',
      show: false
    });
    this.$('.keys-popover').popover({
      content: 'Required variables that must be populated in order to run this example. These keys can be used as environment variables in the code.',
      show: false
    });
  },
  findOrCreateImplementation: function () {
    var specificationId = this.model.id;
    this.options.implementation =
      this.collection.findWhere({ 'implements': specificationId }) ||
      new Implementation({
        'implements': this.model.id,
        subdomain   : utils.domainify(this.model.get('name')) + '-' + uuid.v4(),
        requirements: this.model.get('requirements')
      }, {app:this.app});
  },
  getTemplateData: function () {
    this.findOrCreateImplementation();
    var opts = this.options;
    opts.savetext = opts.savetext || "Save";
    opts.header = opts.header ?
      opts.header.replace(/\{\{name\}\}/g, this.model.get('name')) :
      this.model.get('name') + ' Keys';
    opts.renderedInstructions = marked(this.model.get('instructions'));
    return opts;
  },
  submit: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.disableButtons(true);
    var requirements = $(evt.currentTarget).serializeArray();
    var attrs = {
      requirements: requirements,
      containerId : this.options.containerid
    };
    var implementation = this.options.implementation;
    implementation.save(attrs, utils.cbOpts(callback, this));
    function callback (err) {
      if (err) {
        this.disableButtons(false);
        return this.showError(err);
      }
      this.collection.add(implementation);
      debugger;
      if (this.hasRunButton()) {
        this.options.showrun = true;
        this.render();
      }
      else {
        this.close();
      }
    }
  },
  switchTab: function (evt) {
    evt.stopPropagation();
    $(evt.currentTarget).tab('show');
  },
  showHint: function (evt) {
    $(evt.currentTarget).popover('show');
  },
  hideHint: function (evt) {
    $(evt.currentTarget).popover('hide');
  },
  baseUrl: function (evt) {
    $(evt.currentTarget).select();
  },
  run: function () {
    if (this.hasRunButton()) {
      this.options.runbutton.run();
      this.close();
    }
    else {
      throw new Error('parent must be run button to run..');
    }
  },
  hasRunButton: function () {
    return Boolean(this.options.runbutton);
  }
});

module.exports.id = "ImplementModal";
