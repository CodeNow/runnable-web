var BaseView = require('./base_view');
var _ = require('underscore');
var Images = require('../collections/images');

module.exports = BaseView.extend({
  tagName: 'form',
  className:"navbar-form navbar-left",
  preRender: function () {
    this.attributes = {
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
    this.$('input')
      .typeahead([
        {
          name: 'images',
          valueKey: 'name',
          limit: limit,
          remote: {
            url:'/api/-/runnables?search=%QUERY&limit='+limit,
            filter: function (results) {
              var images = new Images(results, {app:this.app});
              return images.map(function (image) {
                var json = _.pick(image.attributes, 'name', 'description');
                json.url = image.appURL();
                return json
              });
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

module.exports.id = 'SearchBarView';
