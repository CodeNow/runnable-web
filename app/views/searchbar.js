var BaseView = require('./base_view');
var _ = require('underscore');
var Images = require('../collections/images');

module.exports = BaseView.extend({
  tagName:'form',
  events: {
    submit: 'search'
  },
  preRender: function () {
    this.className = this.options.classname;
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
              var ret = images
                .sort(function (a, b) {
                  return (a.sort>b.sort) ? -1 : 1;
                })
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
  },
  search: function (evt) {
    evt.preventDefault();
    var data = $(evt.currentTarget).serializeObject();
    window.location.href = '/search?q='+data.q;
  }
});

module.exports.id = 'Searchbar';
