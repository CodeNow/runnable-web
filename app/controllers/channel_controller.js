var fetch = require('./fetch');

module.exports = {
  index: function(params, callback) {
    var spec = {
      user: {
        model:'User',
        params:{
          _id: 'me'
        }
      },
      projects: {
        collection : 'Projects',
        params     : {
          sort: 'votes',
          tags: params.channel
        }
      }
    };
    fetch.call(this, spec, function (err, results) {
      if (err) {
        callback (err);
      }
      else if (!results || !results.projects || results.projects.length === 0) {
        err = {status:404};
        callback(err);
      }
      else{
        callback(err, 'channel/index', results); //notice callback here include view path (necessary for redirect to work)
      }
    });
  }
};