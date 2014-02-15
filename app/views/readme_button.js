var BaseView = require('./base_view');

module.exports = BaseView.extend({
	events: {
		click: 'click'
	},
	tagName: 'a',
	id: 'open-readme',
	className: 'tooltip',
	attributes: {
		'data-title': "README"
	},
	postHydrate: function () {
		this.app.dispatch.on('toggle:readme', this.toggleReadme, this);
	},
	click: function () {
		this.app.dispatch.trigger('toggle:readme', true);
		this.lastSelectedFile = this.collection.selectedFile();
		if(this.lastSelectedFile)
			this.lastSelectedFile.set('selected', false);
	}, 
	toggleReadme: function (open) {
		if (open) {
			this.$el.addClass('active');
		}
		else {
			this.$el.removeClass('active');	
		}
	}
});

module.exports.id = "ReadmeButton";
