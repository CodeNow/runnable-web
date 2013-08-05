var sitemap = require('sitemap');
var async = require('async');
var request = require('request');
var utils = require('../../app/utils');

module.exports.init = function(app) {

  app.get('/sitemap.xml', function (req, res, next) {
    var urls = [
      { url: '/',  changefreq: 'weekly', priority: 0.7 },
      { url: '/providers',  changefreq: 'monthly',  priority: 0.3 },
      { url: '/about',  changefreq: 'monthly',  priority: 0.5 },
      { url: '/jobs',  changefreq: 'monthly',  priority: 0.5 },
      { url: '/privacy',  changefreq: 'monthly',  priority: 0.1 }
    ];
    async.parallel([
      function channel (cb) {
        request({
          url: 'http://api.runnable.com/channels?map=true',
          json: {}
        }, function (err, res, channels) {
          if (err) {
            return cb(err);
          }
          channels.forEach(function (channel) {
            urls.push({
              url: 'http://runnable.com/' + channel.name,
              changefreq: 'daily',
              priority: 0.5
            });
          });
          cb();
        });
      },
      function project (cb) {
        request({
          url: 'http://api.runnable.com/runnables?map=true',
          json: {}
        }, function (err, res, projects) {
          if (err) {
            return cb(err);
          }
          projects.forEach(function (project) {
            urls.push({
              url: 'http://runnable.com/' +
                project._id +
                '/' +
                utils.urlFriendly(project.name),
              changefreq: 'weekly',
              priority: 0.6
            });
          });
          cb();
        });
      }
    ], function (err) {
      if (err) {
        next(err);
      } else {
        res.header('Content-Type', 'application/xml');
        res.send(sitemap.createSitemap({
          hostname: 'http://runnable.com',
          cacheTime: 600000,
          urls: urls
        }).toString());
      }
    });
  });
};