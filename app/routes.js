module.exports = function(match) {
  match('',                     'home#index');
  match('page/:page',           'home#index');
  match('providers',            'home#providers');
  match('about',                'home#about');
  // match('login',                'home#about');
  match('jobs',                 'home#jobs');
  match('privacy',              'home#privacy');
  match(':_id',                 'project#index');
  match(':_id/:name',           'project#index');
  match(':channel',             'channel#index');
  match(':channel/page/:page',  'channel#index');
};