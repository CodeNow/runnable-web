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
  id: 'implement_modal',
  events: {
    'submit form'     : 'submit',
    'click .nav li a' : 'switchTab'
  },
  auto: false
  // postRender: function () {
  //   Super.postRender.apply(this, arguments);
  // },
  // postInitialize: function () {
  //   //this.findOrCreateImplementation();
  // },
  // findOrCreateImplementation: function () {
  //   var specificationId = this.model.id;
  //   this.options.implementation =
  //     this.collection.findWhere({ 'implements': specificationId }) ||
  //     new Implementation({
  //       'implements': this.model.id,
  //       subdomain   : utils.domainify(this.model.get('name')) + '-' + uuid.v4(),
  //       requirements: this.model.get('requirements')
  //     });
  // },
  // getTemplateData: function () {
  //   var opts = this.options;
  //   opts.renderedInstructions = marked(this.model.get('instructions'));
  //   opts.header = (opts.prepend || '') + this.model.get('name') + ' Settings';
  //   return opts;
  // },
  // submit: function (evt) {
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   var requirements = $(evt.currentTarget).serializeArray();
  //   var attrs = {
  //     requirements: requirements,
  //     containerId : this.options.containerId
  //   };
  //   this.options.implementation.save(attrs, utils.cbOpts(callback, this));
  //   function callback (err) {
  //     if (err) return this.showError(err);
  //     this.collection.add(implementation);
  //     this.close();
  //   }
  // },
  // switchTab: function (evt) {
  //   evt.stopPropagation();
  //   $(evt.currentTarget).tab('show');
  // }
});

module.exports.id = "ImplementModal";