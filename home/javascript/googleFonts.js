WebFontConfig = {
  google: {
    families: [fontUrl + ':400,100,700,800']
  },
  active: function() {
    fontLoaded.resolve();
  }
};

(function(d) {
      var wf = d.createElement('script'), s = d.scripts[0];
      wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      s.parentNode.insertBefore(wf, s);
   })(document);