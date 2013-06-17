var Project = require('../models/project')
  , Base = require('./base');

module.exports = Base.extend({
  model: Project,
  url: function () {
    return (this.page) ? '/projects/page/'+this.page : '/projects';
  },
  parse: function (response) {
    this.paging = response.paging;
    return response.data;
  }
});

module.exports.id = 'Projects';