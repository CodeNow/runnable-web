var BaseView = require('./base_view');
// var router = require('../router');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-fork btn-tertiary',
  events: {
    'click' : 'saveAndOpenContainerPage'
  },
  saveAndOpenContainerPage: function () {
    var self = this;
    this.collection.saveAll(function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        self.app.router.navigate('/me/'+self.options.containerid, true);
      }
    });
  }
});

module.exports.id = 'ForkButton';
