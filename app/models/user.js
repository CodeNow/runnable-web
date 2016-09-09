var Base = require('./base');
var Super = Base.prototype;
var utils = require('../utils');
var _     = require('underscore');
var BaseCollection = require('../collections/base');

var User = module.exports = Base.extend({
  urlRoot: '/users',
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    if (attrs.votes) {
      this.createVotesCollection(attrs.votes);
    }
    else {
      this.listenToOnce(this, 'change:votes', function (model) {
        this.createVotesCollection(model.get('votes'));
      }.bind(this));
    }
  },
  createVotesCollection: function (votes) {
    this.votes = new BaseCollection(votes, {
      app: this.app,
      model: Base,
      url: '/users/' + this.id + '/votes'
    });
  },
  isRegistered : function (){
    return this.get('permission_level') >= 1;
  },
  isVerified : function () {
    return this.get('permission_level') >= 2;
  },
  isModerator : function () {
    return this.get('permission_level') >= 5;
  },
  isAdmin : function () {
    return this.get('permission_level') >= 10;
  },
  canEdit: function (model) {
    return this.isModerator() || this.isOwnerOf(model);
  },
  register: function(email, username, password, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);
    if (!username) {
      cb('Username is required');
    }
    else if (/\s/g.test(username)) {
      cb('Whitespace is not allowed in the username.');
    }
    else if (!email) {
      cb('Email is required');
    }
    else if (!password) {
      cb('Password is required');
    }
    else {
      this.save({
        email: email,
        username: username,
        password: password
      }, {
        wait: true,
        method: 'PUT',
        url   : '/users/me',
        success: success,
        error  : cbOpts.error
      });
      function success () {
        cbOpts.success.apply(this, arguments);
        self.trigger('auth');
      }
    }
  },
  changePass: function(password, passwordNew, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);
    if (!password) {
      cb('Old Password is required');
    }
    else if (!passwordNew) {
      cb('New Password is required');
    }
    else {
      this.save({
        password: password,
        passwordNew: passwordNew
      }, {
        wait: true,
        method: 'POST',
        url   : '/users/me/changepass',
        success: success,
        error  : cbOpts.error
      });
      function success () {
        cbOpts.success.apply(this, arguments);
        self.trigger('auth');
      }
    }

  },
  changeEmailReq: function(emailNew, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);
    if (!emailNew) {
      cb('New Email is required');
    }
    else {
      this.save({
        email_new: emailNew
      }, {
        wait: true,
        method: 'POST',
        url   : '/users/me/changemailreq',
        success: success,
        error  : cbOpts.error
      });
      function success () {
        cbOpts.success.apply(this, arguments);
        self.trigger('auth');
      }
    }

  },
  login: function (emailUsername, password, cb) {
    cb = cb || function () {};
    var self=this, app=this.app, auth, data, opts;

    auth = new Base({}, { url: '/token', app:app });
    data = {
      email   : emailUsername,
      password: password
    };
    opts = utils.cbOpts(saveCallback);

    auth.save(data, opts);
    function saveCallback (err) {
      var meOpts = utils.cbOpts(cb);
      if (err) {
        cb(err);
      }
      else {
        self.fetch({
          url: '/users/me',
          success: success,
          error: meOpts.error
        });
      }
      function success () {
        meOpts.success.apply(this, arguments);
        self.trigger('auth');
      }
    }
  },
  passResetReq: function(emailUsername, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);

    this.save({
      email   : emailUsername
    }, {
      wait: true,
      method: 'POST',
      url   : '/users/passResetReq',
      success: success,
      error  : cbOpts.error
    });
    function success () {
      cbOpts.success.apply(this, arguments);
    }
  },
  verifyUser: function(username, verificationCode, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);

    this.save({
      username: username,
      verification_token: verificationCode
    }, {
      wait: true,
      method: 'POST',
      url   : '/users/verify',
      success: success,
      error  : cbOpts.error
    });
    function success () {
      cbOpts.success.apply(this, arguments);
    }

  },
  sendVerificationMail: function(cb) {
    cb = cb || function () {};
    var self=this, app=this.app, auth, data, opts;
    var cbOpts = utils.cbOpts(cb);

    self.fetch({
      url: '/users/' + this.id + '/sendVerificationMail',
      success: success,
      error: cbOpts.error
    });

    function success () {
      cbOpts.success.apply(this, arguments);
    }
  },
  vote: function (image, cb) {
    if (!this.votes) {
      this.createVotesCollection(this.get('votes'));
    }
    var data = { runnable: image.id };
    var opts = utils.cbOpts(callback, this);

    if (this.hasVotedOn(image.id)) return cb ('You have already voted on this runnable');

    this.votes.create(data, opts);
    image.incVote(); // assume success
    function callback (err, vote) {
      if (err) {
        // rollback
        vote = this.votes.findWhere(data);
        this.votes.remove(vote);
        image.decVote();
        cb (err);
      }
      else {
        cb();
      }
    }
  },
  verifyUserEmail: function(username, verificationCode, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);

    this.save({
      username: username,
      email_change_token: verificationCode
    }, {
      wait: true,
      method: 'POST',
      url   : '/users/changemail',
      success: success,
      error  : cbOpts.error
    });
    function success () {
      cbOpts.success.apply(this, arguments);
    }
  },
  setPass: function(username, token, newPass, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);

    this.save({
      username: username,
      new_pass: newPass,
      pass_reset_token: token
    }, {
      wait: true,
      method: 'POST',
      url   : '/users/setpass',
      success: success,
      error  : cbOpts.error
    });
    function success () {
      cbOpts.success.apply(this, arguments);
    }
  },
  validateToken:  function(username, token, tokenType, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);

    this.save({
      username: username,
      token: token,
      token_type: tokenType
    }, {
      wait: true,
      method: 'POST',
      url   : '/users/validateToken',
      success: success,
      error  : cbOpts.error
    });
    function success () {
      cbOpts.success.apply(this, arguments);
    }
  },
  // hasVoted: function (project, cb) {
  //   var self = this;
  //   cb = cb || function(){};
  //   var checkVote = function () {
  //     var match = self.votes.findWhere({ runnable: project.id });
  //     cb(null, match !== null && match !== undefined);
  //     return match;
  //   };
  //   if (!this.votes) {
  //     this.createVotesCollection([]);
  //     this.votes.fetch();
  //     this.listenToOnce(this.votes, 'sync', checkVote);
  //   } else {
  //     return checkVote();
  //   }
  // },
  hasVotedOn: function (projectOrProjectId) {
    var projectId = projectOrProjectId.id || projectOrProjectId;
    return this.votes.findWhere({ runnable:projectId });
  },
  isOwnerOf: function (model) {
    owner = (model.toJSON) ? model.get('owner') : model.owner;
    return this.id === owner;
  },
  appURL: function () { // kill this method! - be careful it is used aroudn teh app
    return this.appUrl();
  },
  appUrl: function () {
    return '/u/'+this.get('username');
  }
});
module.exports.id = 'User';
