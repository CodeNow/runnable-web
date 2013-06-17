var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/users/me',
  isRegistered : function(){
    return this.get('permission_level') >= 1;
  },
  isModerator : function () {
    return this.get('permission_level') >= 5;
  },
  canEdit: function (model) {
    return this.isModerator() || this.isOwner(model);
  },
  register: function(data, callbacks) {
    var self = this;
    this.save(data, {
      wait: true,
      success: function(model, response, options) {
        Track.event('User', 'Registered');
        callbacks.success(model);
      },
      error: function(model, XHR) {
        try {
          error = JSON.parse(XHR.responseText);
        }
        catch(err) {
          callbacks.error(new Error('Uh oh, an error occurred. Try again later.'));
          return;
        }
        callbacks.error(error); //down here so that it's out of the try catch..
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
