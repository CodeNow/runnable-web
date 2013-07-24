var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'file-upload display-none',
  events: {
    'drop' : 'uploadFiles'
  },
  postHydrate: function () {
    var dispatch = this.app.dispatch;
    var $el = this.$el;
    this.listenTo(dispatch, 'show:upload', this.show.bind(this));
    this.listenTo(dispatch, 'drop:files', this.uploadFiles.bind(this));
  },
  firstShow: true,
  preRender: function () {
    if (!isServer) { //clientside only
      if (false) {
        this.options.fallback = true;
      }
    }
  },
  getTemplateData: function () {
    return this.options;
  },
  show: function () {
    if (this.firstShow) {
      this.firstShow = true;
      this.render(); // force first render clientside, so fallback works
    }
    this.$el.removeClass('display-none')
  },
  hide: function () {
    this.$el.addClass('display-none')
  },
  uploadFiles: function (evt, dirModel) {
    evt.stopPropagation();
    evt.preventDefault();
    evt = evt.originalEvent;
    this.show();
    var files = evt.dataTransfer.files;
    if (files && files.length > 0) {
      Array.prototype.forEach.call(files,
        this.uploadFile.bind(this, dirModel),
      this);
    }
    else {
      /* no browser support */
    }
  },
  createProgressItem: function () {
    function el (tag) {
      var el = document.createElement(tag);
      el._class = function (name) {
        el.className = name;
        return el;
      };
      return el;
    }
    var li = el('li');
    var div = el('div')._class('info');
    li.appendChild(div);
    var progressContainer = el('div')._class('progress-container');
    var progressBar = el('div')._class('progress');
    progressContainer.appendChild(progressBar);
    li.appendChild(progressContainer);
    return li;
  },
  uploadFile: function (dirModel, file) {
    var li = this.createProgressItem();
    var progressBar = li.querySelector('.progress');
    var info = li.querySelector('.info');
    // upload
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress',
      this.handleProgress.bind(this, progressBar)
    );
    xhr.addEventListener("load",
      this.uploadFinished.bind(this, progressBar);
    );

    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("X-File-Name", file.name);
    xhr.setRequestHeader("X-File-Size", file.size);
    xhr.setRequestHeader("X-File-Type", file.type);
    xhr.open("post", this.model.uploadURL(dirModel), true);
    debugger;
    xhr.send(file);

    this.$('.upload-queue').append(li);
  },
  handleProgress: function (progressBar, evt) {
    if (evt.lengthComputable) {
      progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
    }
    //else {/*no data to calculate*/}
  },
  uploadFinished: function (progressBar, evt) {
    // progressBarContainer.className += " uploaded";
    progressBar.innerHTML = "Uploaded!";
  }
});

module.exports.id = "UploadFiles";
