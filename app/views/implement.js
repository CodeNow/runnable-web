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
  events: {
    'click .modal'      : 'stopPropagation',
    'click'             : 'close', // closes modal on bg click
    'click .btn-close'  : 'close',
    'submit form'       : 'submit',
    'click .headly:not(.selected)': 'switchTab'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  postInitialize: function () {
    var specificationId = this.model.id;
    this.implementation = this.collection.models.filter(function (model) { 
      return model.get('implements') === specificationId;
    }).pop() || 
    new Implementation({
      implements: this.model.id,
      subdomain: this.domainify(this.model.get('name')) + '-' + uuid.v4(),
      requirements: this.model.get('requirements').map(function (requirement) {
        return {
          name: requirement,
          value: ''
        };
      })
    });
    this.instructions = true;
    this.url = "http://" + this.implementation.get("subdomain") + "." + this.app.get('domain');
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      implementation: this.implementation,
      instructions: this.instructions,
      rendered: marked(this.model.get('instructions')),
      url: this.url
    });
  },
  submit: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var requirements = Array.prototype.slice.call(this.$('input').filter(function (i, e) { 
      return e.name; 
    }).map(function (i, e) { 
      return { 
        name: e.name, 
        value: e.value 
      }; 
    }));
    this.implementation.set('requirements', requirements);
    this.implementation.set('containerId', this.options.containerId);
    this.implementation.save({}, utils.cbOpts(function (err, savedImplementation) {
      if (err) {
        return alert(err);
      }
      this.collection.add(savedImplementation);
      this.close();
      this.options.parent.click && this.options.parent.click();
    }.bind(this)));
  },
  domainify: function (string) {
    return string.toLowerCase().replace(/[^0-9a-z-]/g, '-');
  },
  switchTab: function () {
    this.instructions = !this.instructions;
    this.render();
  }
});

module.exports.id = "Implement";