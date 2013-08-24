var ModalView = require('./modal_view');
var Super = ModalView.prototype;
var utils = require('../utils');
var _ = require('underscore');
var Specification = require('../models/specification');

module.exports = ModalView.extend({
  events: {
    'click .modal'      : 'stopPropagation',
    'click'             : 'close', // closes modal on bg click
    'click .btn-close'  : 'close',
    'click .login-link': 'openLogin',
    'submit form'      : 'submit',
    'change select'    : 'submit',
    'click button[name=next]': 'submit',
    'click button[name=prev]': 'prev'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  postInitialize: function () {
    this.phase = 1;
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      specification: this.specification,
      phase1: this.phase === 1,
      phase2: this.phase === 2,
      phase3: this.phase === 3,
      new: this.new
    });
  },
  submit: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    debugger;
    if (this.phase === 1) {
      this.parseSelect();
    } else if (this.phase === 2) {
      if (this.new) {
        debugger;
      } else {
        this.next();
      }
    }
  },
  parseSelect: function () {
    var selection = this.$('select').val();
    if (selection === 'null') {
      alert('select a service');
    } else if (selection === 'new') {
      if (this.new) {
        var name = this.$('[name=name]').val();
        var description = this.$('[name=description]').val();
        if (name === '' || description === '') {
          alert('enter values');
        } else {
          this.specification.set('name', name);
          this.specification.set('description', description);
          this.next();
        }
      } else {
        this.new = true;
        this.specification = new Specification({
          name: '',
          description: '',
          instructions: '',
          requirements: []
        });
        this.render();
      }
    } else {
      this.new = false;
      this.specification = this.collection.get(selection);
      this.next();
    }
  },
  newKey: function () {
    alert('new key')
  },
  attachService: function (evt) {
    this.model.set('specification', this.specification.id);
    this.model.save({}, utils.cbOpts(function (err) {
      if (err) {
        console.error(err);
      } else {
        debugger;
      }
    }.bind(this)));
  },
  prev: function () {
    this.phase--;
    this.render();
  },
  next: function () {
    this.phase++;
    this.render();
  }
});

module.exports.id = "AddService";