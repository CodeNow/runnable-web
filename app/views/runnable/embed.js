var BaseView = require('../base_view');

module.exports = BaseView.extend({
  tagName: 'main',
  id: 'embed',
  events: {
  	'click button#embed-run': 'embed_run'
  },
  embed_run: function (evt) {
  	var height=0;
  	var iframe;

  	if(this.$el.find('#project-editor').is(':visible')){
  		height = this.$el.find('#project-editor').height();
  		iframe = document.createElement('iframe');
  		iframe.style.height='100%';
  		iframe.style.width='100%';
  		iframe.src ="http://runnable.com/U0XXcE_rRYJkG5PV/output";
  		this.$el.find('#project-editor').hide();
  	  this.$el.find('#run-output').css('height', height + 'px').html(iframe).show();
  	} else {
      this.$el.find('#project-editor').show();
  	  this.$el.find('#run-output').hide();
  	}

  },
  preRender: function () {
  	this.className = (this.options.showTerminal) ? 'with-terminal' : '';
  },
});

module.exports.id = "runnable/embed";
