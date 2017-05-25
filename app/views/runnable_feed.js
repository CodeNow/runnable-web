var BaseView = require('./base_view');

module.exports = BaseView.extend({

  tagName: 'ul',
  className: 'col-md-10 col-sm-9 runnable-feed',
  events: {
  },
  postRender: function () {
  },
  getTemplateData: function () {
    return this.options;
  }

});

module.exports.id = "RunnableFeed";
