module.exports = function (express, app) {

    // Compress all requests
    var compression = require('compression');
    app.use(compression());

    // Setup public folder ====================================================
    app.set('view engine', 'pug');
    app.set('views', app.viewPath);

    var oneYear = 365 * 24 * 60 * 60 * 1000;
    app.use("/", express.static(app.publicPath, { maxAge: oneYear }));
};