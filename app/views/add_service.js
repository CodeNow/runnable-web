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
  events: {
    'click .modal'      : 'stopPropagation',
    'click'             : 'close', // closes modal on bg click
    'click .btn-close'  : 'close',
    'submit form'      : 'submit',
    'change select'    : 'submit',
    'click button[name=next]': 'submit',
    'click button[name=prev]': 'prev',
    'click button[name=finish]': 'finish',
    'click [type=checkbox]': 'togglePreview'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  postInitialize: function () {
    this.phase = 1;
    this.preview = false;
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      specification: this.specification,
      phase1: this.phase === 1,
      phase2: this.phase === 2,
      phase3: this.phase === 3,
      new: this.new,
      preview: this.preview,
      rendered: this.preview && marked(this.specification.get('instructions'))
    });
  },
  submit: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.phase === 1) {
      this.parseSelect();
    } else if (this.phase === 2) {
      if (this.new) {
        this.adjustKeys($(evt.target).attr("name"));
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
  adjustKeys: function (name) {
    console.log('NAME', name);
    if (name === 'newKey') {
      var key = this.$('[name=new]').val();
      if (key === '') {
        alert('enter value');
      } else {
        var requirements = this.specification.get('requirements');
        requirements.push(key);
        this.specification.set('requirements', requirements);
        this.render();
      }
    } else if (name === 'next') {
      this.next();
    } else {
      var key = name.replace(/^req:/,'');
      var requirements = this.specification.get('requirements');
      requirements = requirements.filter(function (requirement) {
        return requirement !== key;
      });
      this.specification.set('requirements', requirements);
      this.render();
    }
  },
  addService: function () {
    if (!this.preview) {
      this.specification.set('instructions', this.$('textarea').val());
    }
    this.specification.save({}, utils.cbOpts(function (err, saved) {
      if (err) {
        console.error(err);
      } else {
        this.specification = saved;
        this.collection.add(this.specification);
        this.attachService();
      }
    }.bind(this)));
  },
  attachService: function () {
    this.model.set('specification', this.specification.id);
    this.model.save({}, utils.cbOpts(function (err) {
      debugger;
      if (err) {
        console.error(err);
      } else {
        this.options.parent.render();
        this.close();
      }
    }.bind(this)));
  },
  togglePreview: function () {
    if (!this.preview) {
      this.specification.set('instructions', this.$('textarea').val());
    }
    this.preview = !this.preview;
    this.render();
  },
  prev: function () {
    this.phase--;
    this.render();
  },
  next: function () {
    this.phase++;
    this.render();
  },
  finish: function () {
    if (this.new) {
      this.addService();
    } else {
      this.attachService();
    }
  }
});

module.exports.id = "AddService";