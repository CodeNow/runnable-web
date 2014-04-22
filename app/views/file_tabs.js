var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'ul',
  id: 'project-editor-tabs',
  className: 'nav nav-tabs',
  events: {
    'click [data-type="special-tab"]': 'special_tab'
  },
  special_tab: function (evt) {
    var $el = $(evt.currentTarget);
    this.$el.find('li[data-type="special-tab"]').removeClass('active');
    $el.addClass('active');
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove', this.render.bind(this));
  }
});

module.exports.id = "FileTabs";
