var lock = require('./lock');

module.exports = function(match) {

  match('',                           'channel#category');
  // match('',                        'home#press');
  // match('login',                   'home#login');
  match('oauth',                      'user#oauth');
  match('oauth/oauthorize',           'user#oauthorize');
  match('signup',                     'home#signup');
  match('search',                     'runnable#search');
  match('all',                        'channel#all');
  match('all/page/:page',             'channel#all');
  match('publish',                    'home#providers');
  match('about',                      'home#about');
  match('jobs',                       'home#jobs');
  match('privacy',                    'home#privacy');
  match('logout',                     'home#logout');
  // match('blob',                    'home#blob');
  match('new',                        'runnable#new');
  match('new/:from',                  'runnable#newFrom');
  match('u/:username',                'user#profile');
  match('u/verify/:username/:vtoken',  'user#verify');
  match('u/verifymail/:username/:etoken',  'user#verifymail');
  match('admin',                      'admin#dashboard');
  // match('me',                      'user#dashboard');
  // match('me/drafts',               'user#dashboard');
  // match('me/published',            'user#dashboard');
  match('me/:_id',                    'runnable#container');
  match('c/:category',                'channel#category');
  if (lock) {
    match('terminal/load/locked',     'runnable#lockterminal');
    match(':_id',                     'runnable#lock');
    match(':_id/:name',               'runnable#lock');
  }
  else {
    match(':_id',                     'runnable#index');
    match(':_id/output',              'runnable#output');
    match(':_id/imageoutput',         'runnable#imageoutput'); // for pingdom and monitoring, direct access to output page
    match(':_id/dockworker',          'runnable#dockworker'); // for pingdom and monitoring, direct access dockworker
    match(':_id/:name',               'runnable#index');
    match(':_id/:name/embedded',      'runnable#index');
  }
  match(':channel',                   'channel#index');
  match(':channel/page/:page',        'channel#index');
  match(':channel/:_id',              'channel#runnable'); // note! - hits ':id/:name'
  match(':channel/:_id/:name',        'channel#runnable');
};
