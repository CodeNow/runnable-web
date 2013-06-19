var Base = require('./base');
var FileCollection = require('../collections/files');
var DirModel = require('./dir');
var Super = Base.prototype;
var utils = require('../app').prototype.utils; //hacky..
var _ = require('underscore');

module.exports = Base.extend({
  urlRoot: '/runnables',
  initialize: function (model, options) {
    Super.initialize.apply(this, arguments);
    var self = this;
    // Initialize openFiles and rootDir
    this.openFiles = new FileCollection(null, {project:this});
    this.rootDir = new DirModel({path:'/'}, { project:this, silent:true });
    // Events
    this.rootDir.on('change:contents', function () {
      this.rootDir.set({open:true}, {silent:true}); // opens rootDir by default, if it has contents
      var defaultFilepaths = this.get('defaultFile');
      if (defaultFilepaths) {
        defaultFilepaths.forEach(function (filepath) {
          if (filepath[0] !== '/') filepath = '/'+filepath; // prepend slash
          var defaultFile = self.rootDir.getPath(filepath);
          if (defaultFile) self.openFiles.add(defaultFile); // open default files immediately, if they exist
        });
      }
    }, this);
    if (this.get('rootDirectory')) {
      this.onChangeRootDir();
    }
    else {
      this.listenToOnce(this, 'change:rootDirectory', this.onChangeRootDir.bind(this));
    }
    // VoteCount
    this.listenTo(this, 'change:votes', this.onChangeVotes.bind(this));
  },
  onChangeRootDir: function () {
    this.rootDir.set(this.get('rootDirectory'));
    // this.unset('rootDirectory');
  },
  onChangeVotes: function () {
    var votes = this.get('votes') || [];
    this.set('voteCount', votes.length);
    this.set('voted', this.hasUserVoted());
  },
  hasUserVoted: function (userId) {
    userId = userId || this.app.user; // default to current user if no id specified
    if (!userId) return;
    if (typeof userId == 'object' && userId.id) userId = userId.id;
    var votes = this.get('votes') || [];
    return ~votes.indexOf(userId);
  },
  isOwner: function (userId) {
    return (this.get('owner') == userId);
  },
  vote: function (cb) {
    var user = this.app.user;
    if (this.isUserOwner(user)) {
      cb(new Error('You cannot vote on your own example, you silly goose'));
    }
    else if (this.hasUserVoted(user)) {
      cb(new Error('You already voted, you crazy monkey'));
    }
    else {
      var voteUrl = [_.result(this, 'url'), 'votes'].join('/');
      var self = this;
      var options = _.extend(
        { url : voteUrl },
        utils.successErrorToCB(cb)
      );
      var attrs = {
        votes     : _.clone(this.get('votes') || []),
        voteCount : this.get('voteCount')+1
      };
      attrs.votes.push(user.id);
      this.save(attrs, options);
    }
  }
});

module.exports.id = 'Project';
