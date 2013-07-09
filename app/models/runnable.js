var Base = require('./base');
var moment = require('moment');

module.exports = Base.extend({
  virtuals: {
    'niceCreated'   : 'niceCreated'
  },
  isOwner: function (userId) {
    userId = userId || this.app.user; // default to current user if no id specified
    if (!userId) return;
    if (userId.id) userId = userId.id;
    return (this.get('owner') == userId);
  },
  isUserOwner: function (userId) {
    this.isOwner(this, arguments);
  },
  niceCreated: function () {
    return moment(this.get('created')).fromNow();
  }
});

module.exports.id = "Runnable";