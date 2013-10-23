var BaseView = require('./base_view');

module.exports = BaseView.extend({

  events:  {
    'keyup [name=requirement]' : 'addKeyIfEnter',
    'click .add-key'    : 'addKey',
    'click .remove-key' : 'removeKey'
  },
  addKeyIfEnter: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (evt.keycode === 13) {
      this.addKey(evt);
    }
  },
  addKey: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var newReq = this.$('[name=newrequirement]').val().trim();
    var spec = this.options.model;
    var requirements = spec.get('requirements') || [];
    if (newReq && !~requirements.indexOf(newReq)) {
      requirements.push(newReq);
      spec.set('requirements', requirements);
      this.render();
      this.$('[name=newrequirement]').focus();
    }
  },
  removeKey: function (evt) {
    debugger;
    var $addedKeyGroup = $(evt.currentTarget).parents('.added-key');
    var reqToRemove = $addedKeyGroup.find('input').val();
    var spec = this.options.model;
    var reqs = spec.get('requirements');
    var index = reqs.indexOf(reqToRemove)
    if (~index) {
      reqs.splice(index, 1);
      spec.set('requirements', reqs);
      this.render();
    }
  },
});

module.exports.id = "SpecRequirements";
