var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'a',
  attributes: {
    href: 'javascript:void(0)'
  },
  events: {
    click: 'click'
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:name', this.render.bind(this));
  },
  preRender: function () {
    var model = this.model;
    if (model.isDir() && !model.open()) {
      this.className = 'collapsed';
    }
    this.attributes.title = model.get('name');
    this.attributes['data-id'] = model.id;
  },
  postRender: function () {
    this.makeDraggable();
  },
  click: function (evt) {
    evt.preventDefault();
    var model = this.model;
    if (model.isFile()) {
      this.app.dispatch.trigger('open:file', model);
    }
    else { // isDir
      var animating = this.$el.next().hasClass('animating');
      if (animating) return;

      if (model.open()) {
        this.$el.addClass('collapsed');
        model.set('open', false);
      }
      else {
        this.$el.removeClass('collapsed');
        model.set('open', true);
      }
    }
  },
  makeDraggable: function () {
    if (!this.model.isRootDir()) {
      this.$el.draggable({
        opacity: 0.8,
        helper: "clone",
        containment: "#file-tree"
      });
    }
  }
});

module.exports.id = "FileTreeLink";
