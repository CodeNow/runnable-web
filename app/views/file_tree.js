var BaseView = require('./base_view');
var _ = require('underscore');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'li',
  className: 'folder',
  events: {
    'click span.dir' : 'toggle'
  },
  postHydrate: function () {
    // clientside
    // postHydrate is the place to attach data events
    this.path = this.options.path;
    this.dir = this.model.rootDir.getPath(this.path);
    this.listenTo(this.dir.contents(), 'reset add remove', this.render.bind(this));
  },
  getTemplateData: function () {
    // be careful postHydrate has only been called before frontend render but not backend!
    // this means, the only data you can rely on is this.model and this.options binded to this view.
    this.path = this.path || this.options.path;
    this.dir  = this.dir  || this.model.rootDir.getPath(this.path);
    return {
      dirJSON      : this.dir.toJSON(),
      project      : this.model
    };
  },
  postRender: function () {
    // clientside postHydrate and getTemplateData have occured.
    if (this.dir.get('open')) this.$el.addClass('open');
  },
  slideUpHeight: function () {
    this.$el.removeClass('open');
    this.$contentsUL.slideUp(200, function () {
      this.animating = false;
    }.bind(this));
  },
  slideDownHeight: function () {
    this.$el.addClass('open');
    this.$contentsUL.slideDown(200, function () {
      this.animating = false;
    }.bind(this));
  },
  toggle: function (evt) {
    var clickedId = $(evt.currentTarget).data('id');
    if (this.dir.id == clickedId && !this.animating) {
      this.animating = true;
      if (this.dir.get('open')) {
        this.close();
      }
      else {
        this.open();
      }
    }
    return this;
  },
  open: function () {
    this.dir.set('open', true);
    this.slideDownHeight();
    // fetch the dir contents if not fetched.
    var self = this;
    if (this.dir.isNew()) {
      this.dir.fetch({
        error: function () {
          alert('error');
        }
      });
    }
  },
  close: function () {
    this.dir.set('open', false);
    this.slideUpHeight();
  }
});

module.exports.id = "FileTree";
