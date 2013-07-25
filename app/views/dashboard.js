var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  events: {
    'change select': 'action'
  },
  getTemplateData: function () {
    //debugger;
    return _.extend(this.options, {
      prevLink: '',
      nextLink: ''
    });
  },
  action: function (evt) {
    var action = this.$el.find('select').val().toLowerCase();   
    if (action in {
      unpublish: true,
      "delete": true
    }) {
      action = action === 'delete' ? 'destroy' : action;
      var self = this;
      this.$el.find('input[type=checkbox]:checked')
      .map(function (i, elem) { 
        return self.collection.findWhere({ 
          _id: elem.name
        })
      })
      .each(function (i, model) {
        console.log(model);
      });
    }
  }
});

module.exports.id = "dashboard";