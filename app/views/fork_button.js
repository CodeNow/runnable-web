var BaseView = require('./base_view');
// var router = require('../router');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-fork btn-tertiary',
  events: {
    'click' : 'click'
  },
  click: function () {
    this.disable(true);
    this.collection.saveAll(function (err) {
      this.disable(false);
      if (err) {
        this.showError(err);
      }
      else {
        this.app.router.navigate('/me/'+this.options.containerid, true);
      }
    }, this);
  }
});

module.exports.id = 'ForkButton';
