var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'li',
  events: {
    'click a'           : 'select',
    'click .close-file' : 'close'
  },
  postInitialize: function () {
    var file = this.options.model;
    console.log(file && file.get('selected'));
    console.log(file && file.get('selected'));
    console.log(file && file.get('selected'));
    console.log(file && file.get('selected'));
    console.log(file && file.get('selected'));
    if (file && file.get('selected')) {
      this.className = 'selected';
    }
  },
  select: function () {
    this.model.set('selected', true);
  },
  close: function () {
    this.model.collection.remove(model);
  }
});

module.exports.id = "FileTab";
