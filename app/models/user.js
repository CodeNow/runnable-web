var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/users',
  isRegistered : function(){
    return this.get('permission_level') >= 1;
  },
  isOwner : function (model) {
    return model.get('owner') == this.get('_id');
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
  }
});
module.exports.id = 'User';
