var _ = require('underscore');
module.exports = {
  index: function(params, callback) {
    var spec = {
      user: { model:'User', params:{} },
      projects: {
        collection : 'Projects',
        params     : {
          page: params.page,
          sort: '-voteCount'
        }
      }
    };
    this.app.fetch(spec, function (err, results) {
      callback(err, results);
    });
  },
  jobs: function (params, callback) {
    var spec = {
      user: { model:'User', params:params }
    };
    this.app.fetch(spec, function (err, results) {
      callback(err, results);
    });
  },
  privacy: function (params, callback) {
    var spec = {
      user: { model:'User', params:params }
    };
    this.app.fetch(spec, function (err, results) {
      callback(err, results);
    });
  },
  about: function (params, callback) {
    var spec = {
      user: { model:'User', params:params }
    };
    this.app.fetch(spec, function (err, results) {
      callback(err, results);
    });
  },
  providers: function (params, callback) {
    var spec = {
      user: { model:'User', params:params }
    };
    this.app.fetch(spec, function (err, results) {
      callback(err, results);
    });
  },
  blob : function (params, callback) {
    var spec = {
      user: { model:'User', params:params }
    };
    this.app.fetch(spec, function (err, results) {
      callback(err, results);
    });
  }
};
