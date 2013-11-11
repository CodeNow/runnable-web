var RendrBase = require('rendr/shared/base/collection');
var Super = RendrBase.prototype;
var _ = require('underscore');

module.exports = RendrBase.extend({
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    if (options) {
      _.extend(this, _.pick(options, 'params'));
    }
  },
  parse: function (response) {
    if (this.debugParse) {
      console.log(response);
    }
    return Super.parse.apply(this, arguments);
  },
  insert: function (index, model) {
    this.add(model, { at:index });
  },
  _prepareModel: function(attrs, options) {
    // BACKBONE BUG WORKAROUND
    // collection.fetch options -> collection.set -> _prepareModel -> model.set
    // collection.fetch options should not be sent to set... especially not the url
    // since I am not super familiar with _prepareModel I have only removed url for now.
    delete options.url; // collection options url should not be passed to model!
    var model;
    model = Super._prepareModel.call(this, attrs, options);
    model.app = this.app;
    return model;
  },
  sortByAttr: function (attr) {
    if (attr.indexOf('-') === 0) {
      descending = true;
      attr = attr.slice(1);
    }
    this.comparator = attr;
    this.sort();
    if (descending) this.models.reverse();
    return this;
  }
});

module.exports.id = 'Base';