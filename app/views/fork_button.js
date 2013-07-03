var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-fork btn-tertiary',
  events: {
    'click' : 'saveAndOpenContainerPage'
  },
  saveAndOpenContainerPage: function () {
    debugger;
    this.model.openFiles.saveAll(function (err) {
      if (err) {
        alert(err);
      }
      else {
        // open container
      }
    });
  }
});

module.exports.id = 'ForkButton';
