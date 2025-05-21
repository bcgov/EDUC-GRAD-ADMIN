exports.defineTags = function(dictionary) {
  dictionary.defineTag("testing", {
      mustHaveValue: true,
      canHaveName: false, 
      onTagged: function (doclet, tag) {
        doclet.testing = tag.value;
      }
  });
};

exports.handlers = {
  newDoclet: function(e) {
    let title = e.doclet.testing
    if (title) {
      e.doclet.description = `<h2>${title}</h2>`
    }
  }
}
