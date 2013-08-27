module.exports = function(match) {
  match('',                     'channel#category');
  match('all',                  'channel#all');
  match('all/page/:page',       'channel#all');
  match('providers',            'home#providers');
  match('about',                'home#about');
  match('jobs',                 'home#jobs');
  match('privacy',              'home#privacy');
  match('logout',               'home#logout');
  // match('blob',                 'home#blob');
  match('new',                  'runnable#new');
  match('newhome',              'home#newhome');
  match('new/:from',            'runnable#newFrom');
  match('me/published',         'user#published');
  match('me/drafts',            'user#drafts');
  match('me/:_id',              'runnable#container');
  match('c/:category',          'channel#category');
  match(':_id',                 'runnable#index');
  match(':_id/output',          'runnable#output');
  match(':_id/:name',           'runnable#index');
  match(':channel',             'channel#index');
  match(':channel/page/:page',  'channel#index');
  match(':channel/:_id',        'channel#runnable'); // note! - hits ':id/:name'
  match(':channel/:_id/:name',  'channel#runnable');
};
