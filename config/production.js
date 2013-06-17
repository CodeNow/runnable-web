// Config settings for NODE_ENV=production

exports.config = {
  assets: {
    minify: true,
    cdn: {
      protocol: 'https',
      cnames: ['localhost'],
      pathPrefix: ''
    }
  },

  api: {
    'default': {
      host: 'api.github.com',
      protocol: 'https'
    },
    'travis-ci': {
      host: 'api.travis-ci.org',
      protocol: 'https'
    }
  },

  "rendrApp": {
    "mixpanel" : {
      "key": "8790acfcca0cab43adebbc796f1d4f96"
    },
    "googleAnalytics" : {
      "id": "UA-36631837-1"
    }
  }
};
