var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  tagName: 'ul',
  preRender: function () {
    var opts = this.options;
    var actionClass = 'd'+opts.directoryid; //must match file_tree_item data-target
    this.className = (opts.open) ?
      'fs-list nav-collapse in' :
      'fs-list nav-collapse collapse';
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove reset sync', this.render.bind(this));
  },
  getTemplateData: function () {
    return this.options;
  },
  toggle: function (open) {
    if (open) {
      this.slideDownHeight();
      this.open();
    }
    else {
      this.slideUpHeight();
    }
  },
  open: function () {
    // fetch the dir contents if not fetched.
    var collection = this.collection;
    // if (!collection.fetched) {
    if (true) {
      var options = _.extend(utils.cbOpts(cb, this), {
        data: _.clone(collection.params), // VERY IMPORTANT! - ask TJ.
        silent: true,           // silent until all the models are for sure in store..
        merge: true             // so model 'selected' dont get reset
      });
      collection.fetch(options);
    }
    // Firefox does not hoist functions in blocks!
    function cb (err, collection) {
      if (err) {
        this.showError(err);
      }
      else {
        collection.forEach(function (model) {
          model.store(); // VERY IMPORTANT! - ask TJ.
          if (model.isDir()) model.contents.store();
        });
        collection.trigger('sync');
      }
    }
  },
  render: function () {
    Super.render.apply(this, arguments);
  },
  slideUpHeight: function () {
    var $el = this.$el;
    $el.addClass('animating');
    $el.slideUp(200, function () {
      $el.removeClass('animating');
    });
  },
  slideDownHeight: function () {
    var $el = this.$el;
    $el.addClass('animating');
    $el.slideDown(200, function () {
      $el.removeClass('animating');
    });
  }
});

module.exports.id = "FsList";