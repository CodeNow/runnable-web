var _ = require('underscore');
var fetch = require('./fetch');


module.exports = {
  index: function(params, callback) {
    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      projects: {
        collection : 'Projects',
        params     : {
          sort: '-votes'
        }
      }
    };
    fetch.call(this, spec, callback);
  },

  jobs: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  privacy: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  about: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  providers: function (params, callback) {
    console.log(this.currentRoute)
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  blob: function (params, callback) {
    console.log('BLOBBBB');
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  }
};
