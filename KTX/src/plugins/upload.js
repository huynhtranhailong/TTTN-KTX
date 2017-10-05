module.exports = function(app) {

    var multer = require('multer');

    app.plugins.Upload = {
        singleByDestination: function (destination) {
            return multer({ dest: app.publicPath + destination }).single('file');
        },
        multipleByDestination: function (destination) {
            return multer({ dest: app.publicPath + destination }).any();
        }
    }

};