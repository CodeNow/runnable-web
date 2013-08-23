var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var Specification = require('../models/specification');

module.exports = BaseView.extend({
  tagName: 'form',
  events: {
    'submit' : 'addService'
  },
  addService: function (evt) {

        
    debugger;
    evt.preventDefault();
    evt.stopPropagation();
    var specification = new Specification({
      name: 'bobby',
      description: 'test',
      instructions: 'do it',
      requirements: [
        'thing'
      ]
    });
    var options = utils.cbOpts(saveCallback.bind(this));
    specification.save({}, options);
    function saveCallback (err, specificationSaved) {
      if (err) {
        console.error(err);
      } else {
        this.collection.add(specificationSaved);
      }
    }
  }
});

module.exports.id = "AddService";