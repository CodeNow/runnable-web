module.exports = function(match) {
  match('',                     'home#index');
  match('page/:page',           'home#index');
  match('providers',            'home#providers');
  match('about',                'home#about');
  match('jobs',                 'home#jobs');
  match('privacy',              'home#privacy');
  match('logout',               'home#logout');
  match('blob',                 'home#blob');
  match('new',                  'runnable#new');
  match('new/:from',            'runnable#newFrom');
  match('me/:_id',              'runnable#container');
  match(':_id',                 'runnable#index');
  match(':_id/output',          'runnable#output');
  match(':_id/:name',           'runnable#index');
  match(':channel',             'channel#index');
  match(':channel/page/:page',  'channel#index');
  // match(':channel/:_id/',       'runnable#index');
  // match(':channel/:_id/:name',  'runnable#index');

};
