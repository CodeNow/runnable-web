module.exports = function(match) {
  match('',                'home#index');
  match('providers',       'home#providers');
  match('about',           'home#about');
  match('jobs',            'home#jobs');
  match('privacy',         'home#privacy');
};
