var Channel = require('../models/channel'),
    Base = require('./base');
var _ = require('underscore');
function lowercase (a) {
  return a.toLowerCase();
}

module.exports = Base.extend({
  model: Channel,
  url: '/channels',
  comparator: function (a, b) {
    return 0;
    if (this.params.category.toLowerCase() !== 'featured') return 0;
    var order = [
       "nodejs"
      ,"python"
      ,"ruby-on-rails"
      ,"PHP"
      ,".net"
      ,"jQuery"
      ,"codeigniter"
      ,"django"
      ,"CakePHP"
      ,"paypal"
      ,"mysql"
      ,"node-mongodb-native"
    ];
    var orderA = a.get('aliases').map(lowercase).map(function (a) {
      return order.indexOf(a);
    }).pop();
    var orderB = b.get('aliases').map(lowercase).map(function (a) {
      return order.indexOf(a);
    }).pop();
    console.log(a.get('name'), b.get('name'));
    console.log(a.get('aliases'), b.get('aliases'));
    console.log(orderA, orderB)
    return orderA === orderB ? 0 : (orderA < orderB ? -1 : 1);
  }
});

module.exports.id = 'Channels';