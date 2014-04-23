var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id:'project-url',
  className: 'col-sm-3',
  events: {
    'click input' : 'selectAll'
  },
  selectAll: function () {
    this.$('input').select();
  }
});

module.exports.id = "ProjectUrl";
