var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'readonly-message',
  className: 'status-bar yellow',
  postRender: function () {
    // sets ace to readonly if readonly message appears
    this.ace.edit('project-editor').setReadOnly(true);
  }
});

module.exports.id = "ReadonlyMessage";
