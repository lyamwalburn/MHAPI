const fs = require('fs')
const path = require('path');
const imagePath = path.join(path.resolve(__dirname, '..'), '/public/images/ingredients');

module.exports = {
 getDirectoryContent: function(req, res, next) {
    fs.readdir(imagePath , function (err, images) {
      if (err) { return next(err); }
      res.locals.filenames = images;
      next();
    });
  }
}