var Base = require('./base');
var utils = require('../utils');
var inside = utils.inside;
var not = utils.not;

module.exports = Base.extend({
  isOwner: function (userId) {
    userId = userId || this.app.user; // default to current user if no id specified
    if (!userId) return;
    if (userId.id) userId = userId.id;
    return (this.get('owner') == userId);
  },
  isUserOwner: function (userId) {
    this.isOwner(this, arguments);
  },
  nameWithTags: function (surroundTagsWithBrackets) {
    var name = this.get('name');
    var lower = name.toLowerCase();
    var tagsNotInName = this.get('tags').filter(function (tag) {
      var lowerTag = tag.name.toLowerCase();
      var nameParts = lowerTag.split(/[- ]+/);
      if (nameParts.length === 0) nameParts = [lowerTag];
      return nameParts.every(not(inside(lower)));
    });
    var tagStr = '';
    if (tagsNotInName.length) {
      if (surroundTagsWithBrackets) {
        tagStr = ' [' + utils.tagsToString(tagsNotInName) + ']';
      }
      else {
        tagStr = ' for ' + utils.tagsToString(tagsNotInName);
      }
    }
    return name + tagStr
  }
});

module.exports.id = "Runnable";