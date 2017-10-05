module.exports = function(app) {

    // Connect MongoDB ----------------------------------------------------------------------------
    app.db = require('mongoose');
    app.db.connect(app.dbUrl);

    // DB connection events
    var connection = app.db.connection;
    connection.on("error", console.error.bind(console, "The MongoDB connection error"));
    connection.once("open", function(callback) { console.log("The MongoDB connection succeeded."); });

    // Define all models --------------------------------------------------------------------------
    app.model = {};

    // Load common models
    const fs = require('fs');
    var list = fs.readdirSync(app.modelPath);
    list.forEach(function(modelFilename) {
        var modelName = app.path.basename(modelFilename, app.path.extname(modelFilename)),
            modelPath = app.path.join(app.modelPath, modelFilename);
        if (fs.existsSync(modelPath) && fs.statSync(modelPath).isFile()) {
            app.debug('Init: load model => ' + modelFilename);
            require(modelPath)(app);
        }
    });

    // Load module models
    list = fs.readdirSync(app.modulePath);
    list.forEach(function(moduleName) {
        var modelPath = app.path.join(app.modulePath, moduleName) + '/model.js';
        if (moduleName != '.' &&  fs.existsSync(modelPath) && fs.statSync(modelPath).isFile()) {
            app.debug('Init: load model => ' + moduleName);
            require(modelPath)(app);
        }
    });
};