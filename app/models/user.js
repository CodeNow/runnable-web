var Base = require('./base');

module.exports = Base.extend({
  isRegistered : function(){
    return this.get('permission_level') >= 1;
  },
  isModerator : function () {
    return this.get('permission_level') >= 5;
  },
  canEdit: function (model) {
    return this.isModerator() || this.isOwner(model);
  },
  register: function(email, password, cb) {
    this.save({
      email: email,
      password: password
    }, {
      wait: true,
      success: function(model, response, options) {
        // Track.event('User', 'Registered');
        cb();
      },
      error: function(model, XHR) {
        var error = JSON.parse(XHR.responseText);
        cb(null, error.message);
      }
    });
  },
  vote: function (project) {
    if (hasVoted(project)) { return false; } else {
      var votes = this.get('projectVotes') || [];
      votes.push(project._id);
      return true;
    }
  },
  hasVoted: function (project) {
    var votes = this.get('projectVotes') || [];
    return votes.indexOf(project._id) !== -1;
  }
});
module.exports.id = 'User';
