module.exports = {
  index: function(params, callback) {
    var spec = {
      user: { model:'User', params:{} },
      projects: {
        collection : 'Projects',
        params     : {
          page: params.page,
          sort: 'votes.length',
          tags: params.channel
        }
      }
    };
    this.app.fetch(spec, function (err, results) {
      results.channel = params.channel;
      callback(err, results);
    });
  },
  project: function (params, callback) {
    // var spec = {
    //   collection: {collection: 'Collection', params: params}
    // };
    // this.app.fetch(spec, function(err, result) {
    //   callback(err, '<% _.underscored(this.name) %>_index_view', result);
    // });
    callback();
  }
};