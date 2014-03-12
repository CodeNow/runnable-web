var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'ul',
  className: 'col-sm-10 runnable-feed'
});

module.exports.id = "RunnableFeed";
