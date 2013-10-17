var BaseView = require('./base_view');
var ImplementModal = require('./implement_modal');

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
    var specification = this.model;
    return this.collection.hasCompleteImplementationFor(specification);
  },
  openImplementModal: function (evt) {
    if (evt) evt.preventDefault();

    var implementModal = new ImplementModal(this.options);
    implementModal.open();

    return implementModal;
  }
});

module.exports.id = "ImplementLink";
