var _ = require('underscore');
var BaseView = require('./base_view');
var utils = require('../utils');
var ImplementModal = require('./implement_modal');

module.exports = BaseView.extend({
  tagName: 'form',
  events: {
    'click .enter-keys' : 'openImplementModal',
    'submit'            : 'saveImplementation',
    'change input'      : 'saveImplementation'
  },
  postInitialize: function () {
    if (this.options.classname) {
      this.className = this.options.classname;
    }
  },
  postRender: function () {
    this.$('.url-popover').popover({
      content: 'Use this as the base for a callback URL or redirect URL. This can be used as the permanent url of this application.',
      show: false
    });
    this.implementLink = _.findWhere(this.childViews, {name:'implement_link'});
    this.listenTo(this.collection, 'add', this.render.bind(this)); //check if imp created matches: findImplementation
    // done by parent
    // this.listenTo(this.model, 'change:requirements', this.render.bind(this));
  },
  findImplementation: function () {
    var specificationId = this.model.id;
    this.options.implementation =
      this.collection.findWhere({ 'implements': specificationId });
  },
  getTemplateData: function () {
    debugger;
    this.findImplementation();
    return this.options;
  },
  userImplementedSpec: function () {
    var specification = this.model;
    return this.collection.hasCompleteImplementationFor(specification);
  },
  openImplementModal: function (evt) {
    if (evt) evt.preventDefault();

    var implementModal = new ImplementModal(this.options);
    implementModal.open();

    return implementModal;
  },
  saveImplementation: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.findImplementation();
    this.listenToImplementation();
    if (this.options.implementation) {
      var $input = $(evt.currentTarget);
      var requirements = this.$el.serializeArray();
      var attrs = {
        requirements: requirements,
        containerId : this.options.containerid
      };
      var opts = utils.cbOpts(callback, this);
      this.options.implementation.save(attrs, opts);
    }
    function callback (err) {
      if (err) {
        this.showError('Error saving changes to keys, try again');
      }
      else {
        $input.addClass('success');
        setTimeout($input.removeClass.bind($input, 'success'), 1000);
      }
    }
  },
  listenToImplementation: function () {
    //listen to implementation for changes
    if (this.listeningToImplementation || !this.options.implementation) return;
    this.listeningToImplementation = true;
    this.listenTo(this.options.implementation, 'change:requirements', this.render.bind(this))
  }
});

module.exports.id = "ImplementForm";
