// Config settings for NODE_ENV=development

exports.config = {
  "assets": {
    "minify": false,
    "cdn": {
      "protocol": "http",
      "cnames": ["localhost"],
      "pathPrefix": ""
    }
  },

  "api": {
    "default": {
      "host": "localhost:3030/api",
      "protocol": "http"
    }
  },

  "rendrApp": {
    "mixpanel" : {
      "key": "de848319a0091fb3a5876184d81a40ec"
    },
    "googleAnalytics" : {
      "id": "UA-36631837-2"
    }
  }
};
