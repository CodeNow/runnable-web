var BaseView = require('./base_view');
var ImplementModal = require('./implement_modal');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'a',
  events: {
    click: 'openImplementModal'
  },
  preRender: function () {
    var opts = this.options;
    this.className = opts.classname || '';
    this.attributes = {
      href: 'javascript:void(0);'
    }
  },
  userImplementedSpec: function () {
    var implementations = this.collection;
    var specification = this.model;
    var i = implementations.findWhere({
      'implements' : specification.id
    });
    return Boolean(i);
  },
  openImplementModal: function (evtOrOpts) {
    var evt, opts;
    if (evtOrOpts.preventDefault) {
      evt = evtOrOpts;
      evt.preventDefault();
    }
    else {
      opts = evtOrOpts;
    }
    var implementModal = new ImplementModal(this.options);
    if (opts && opts.onClose) {
      this.listenToOnce(implementModal, 'close', opts.onClose);
    }
    implementModal.open();
  }
});

module.exports.id = "ImplementLink";
