var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'a',
  id: 'open-readme',
  className: 'tooltip',
  attributes: {
    'data-title': 'README'
  },
  events: {
    click: 'click'
  },
  postHydrate: function () {
    this.app.dispatch.on('toggle:readme', this.toggleReadme, this);
  },
  click: function () {
    this.app.dispatch.trigger('toggle:readme', true);
    this.collection.unselectAllFiles();
  },
  preRender: function () {
    var opts       = this.options;
    var readmeFile = this.model.contents.find(function(data){
      return data.get('name') && data.get('name').toLowerCase() === 'readme.md';
    });
    if (readmeFile) {
      this.className += ' active';
    }
  },
  toggleReadme: function (open) {
    if (open) {
      this.$el.addClass('active');
    }
    else {
      this.$el.removeClass('active');
    }
  }
});

module.exports.id = "ReadmeButton";
