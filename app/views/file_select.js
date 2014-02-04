var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'project-select-tabs',
  className: 'dropdown',
  events: {
    'change select' : 'changeSelect'
  },
  changeSelect: function () {
    var selectedIndex = this.$('select')[0].selectedIndex;
    this.collection.at(selectedIndex).set('selected', true);
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'change', this.render.bind(this));
  }
});

module.exports.id = 'FileSelect';
