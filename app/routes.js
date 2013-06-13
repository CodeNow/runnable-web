module.exports = function(match) {
  console.log(match.toString());
  console.log((new Error()).stack);
  match('',               'home#index');
  match('providers',      'home#providers');
  match('about',          'home#about');
  match('jobs',           'home#jobs');
  match('privacy',        'home#privacy');
  match(':_id',           'project#index');
  match(':_id/:name',     'project#index');
  match(':channel',       'channel#index');
  match(':channel/:_id/', 'channel#project');
};
