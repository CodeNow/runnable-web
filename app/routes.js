var lock = require('./lock');

module.exports = function(match) {
  match('',                     'channel#category');
  match('signup',               'home#signup');
  match('search',               'runnable#search');
  match('all',                  'channel#all');
  match('all/page/:page',       'channel#all');
  match('publish',              'home#providers');
  match('about',                'home#about');
  match('jobs',                 'home#jobs');
  match('privacy',              'home#privacy');
  match('logout',               'home#logout');
  match('new',                  'runnable#new');
  match('new/:from',            'runnable#newFrom');
  match('u/:username',          'user#profile');

  // new routes
  match(':username/:projectname', 'runnable#project');

  // match('',                     'home#press');
  // match('login',                'home#login');
  // match('blob',                 'home#blob');
  // match('me',                   'user#dashboard');
  // match('me/drafts',            'user#dashboard');
  // match('me/published',         'user#dashboard');
  // match('me/:_id',              'runnable#container');
  // match('c/:category',          'channel#category');
  // match(':_id',                 'runnable#index');
  // match(':_id/output',          'runnable#output');
  // match(':_id/imageoutput',     'runnable#imageoutput'); // for pingdom and monitoring, direct access to output page
  // match(':_id/dockworker',      'runnable#dockworker'); // for pingdom and monitoring, direct access dockworker
  // match(':_id/:name',           'runnable#index');
  // match(':_id/:name/embedded',  'runnable#index');
  // match(':channel',             'channel#index');
  // match(':channel/page/:page',  'channel#index');
  // match(':channel/:_id',        'channel#runnable'); // note! - hits ':id/:name'
  // match(':channel/:_id/:name',  'channel#runnable');
};
