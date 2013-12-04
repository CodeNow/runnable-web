var BaseView = require('./base_view');
var _ = require('underscore');
var Images = require('../collections/images');

function sortBySort(a, b) {
  return (a.sort>b.sort) ? -1 : 1;
}

module.exports = BaseView.extend({
  tagName:'form',
  preRender: function () {
    this.className = 'searchbar'+ ( this.options.classname ? ' '+this.options.classname : '' );
    this.attributes = {
      action: '/search',
      method: 'get'
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
    this.$('input')
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
              images.comparator = sortBySort;
              var ret = images
                .sort()
                .map(function (image) {
                  var json = _.pick(image.attributes, 'name', 'description');
                  json.url = image.appURL();
                  return json;
                });
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
    this.app.set('loading', true);
    window.location.href = data.url;
  }
});

module.exports.id = 'Searchbar';