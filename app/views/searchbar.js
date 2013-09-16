var BaseView = require('./base_view');
var _ = require('underscore');
var Images = require('../collections/images');

module.exports = BaseView.extend({
  tagName:'input',
  preRender: function () {
    var opts = this.options;
    this.className = opts.classname;
    this.attributes = {
      type:'text',
      placeholder: opts.placeholder,
      role:'search'
    };
  },
  postRender: function () {
    var engine = {
      compile: function (template) {
        var compiled = _.template(template);
        return {
          render: function (data) {
            return compiled(data);
          }
        };
      }
    };
    var limit = 7;
    this.$el
      .typeahead([
        {
          name: 'images',
          valueKey: 'name',
          limit: limit,
          remote: {
            url:'/api/-/runnables?search=%QUERY&limit='+limit,
            filter: function (results) {
              results.forEach(function (result, index) {
                result.sort = index;
              });
              var images = new Images(results, {app:this.app});
              var ret = images
                .sort(function (a, b) {
                  return (a.sort>b.sort) ? -1 : 1;
                })
                .map(function (image) {
                  var json = _.pick(image.attributes, 'name', 'description');
                  json.url = image.appURL();
                  return json
                });
              debugger;
              return ret;
            }
          },
          template: [
            '<p class="search-name" data-url="<%= url %>"><%= name %></p>',
          ].join(''),
          engine: engine
        }
      ])
      .on('typeahead:selected', this.onSelect.bind(this));
  },
  onSelect: function (evt, data) {
    window.location.href = data.url;
  }
});

module.exports.id = 'Searchbar';
