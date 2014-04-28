var BaseView = require('./base_view');
var utils = require('../utils');
var Image = require('../models/image');
var _ = require('underscore');
var keypather = require('keypather')();

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'h1',
  events: {
    // 'click .edit'   : 'clickEdit',
    'keyup form input[name="name"]' : 'titleChange',
    'submit form'                   : 'submitName',
    'click .cancel'                 : 'escEditMode'
  },
  titleChange: function () {
    var $el = this.$el.find('form input[name="name"]');
    if ($el.val() === this.model.get('name'))
      return;
    this.app.dispatch.trigger('trigger:titleChange', true);
  },
  postRender: function () {
    this.listenTo(this.model, 'change:name change:tags', this.render.bind(this));
    this.app.dispatch.on('trigger:saveAll', this.submitName, this);
  },
  getTemplateData: function () {
    this.model.virtual.nameWithTags = this.model.nameWithTags(true);
    this.options.canedit = !(this.model instanceof Image) &&
      this.app.user.canEdit(this.model);
    return this.options;
  },
  // clickEdit: function (evt) {
  //   evt.preventDefault();
  //   this.setEditMode(true);
  // },
  // escEditMode: function () {
  //   this.setEditMode(false);
  // },
  // setEditMode: function (bool) {
  //   this.options.editmode = bool;
  //   this.render();
  // },
  submitName: function (evt) {
    if (_.isFunction(keypather.get(evt, 'preventDefault')))
      evt.preventDefault();
    var $form = this.$el.find('form');
    var formData = $form.serializeObject();
    // this.options.editmode = false; // assume success, change will rerender
    if (formData.name === this.model.get('name')) {
      return this.render();
    }
    var opts = utils.cbOpts(cb, this);
    opts.patch = true;
    this.model.save(formData,  opts);

    function cb (err) {
      if (err === 'a shared runnable by that name already exists') {
        this.$('form').append('<div class="alert alert-warning"><strong>That name is taken!</strong> Try something else.</div>');
      } else if (err) {
        this.showError(err);
      } else {
        this.app.dispatch.trigger('trigger:titleChange', false);
      }
    }
  }
});

module.exports.id = 'RunnableTitle';
