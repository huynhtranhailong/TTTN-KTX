var express = require('express');
var app = express();
var http = require('http').Server(app);

// Variables ===========================================================================================================
app.title = 'Kí túc xá Bách Khoa';
app.isDebug = true;
//app.dbUrl = 'mongodb://baoduyhp:duytran2903@ds127872.mlab.com:27872/ktxbk';
app.dbUrl = 'mongodb://localhost/ktxbk';
app.path = require('path');
app.io = require('socket.io')(http);
app.fs = require('fs');
app.viewPath = app.path.join(__dirname, 'src/layout') + '/';
app.pluginPath = app.path.join(__dirname, 'src/plugins') + '/';
app.modulePath = app.path.join(__dirname, 'src/module') + '/';
app.modelPath = app.path.join(__dirname, 'src/models') + '/';
app.publicPath = app.path.join(__dirname, 'public');
app.faviconPath = app.path.join(__dirname, 'public/favicon.ico');
app.numOfUser = 1000;

// Init functions ======================================================================================================
app.debug = function (message) {
    if (app.isDebug) console.log(message);
};

// Configure ===========================================================================================================
require('./src/config/packages')(app);
require('./src/config/database')(app);
require('./src/config/authentication')(app);
require('./src/config/view')(express, app);
require('./src/config/routes')(app);

// Load all plugin files ===============================================================================================
app.plugins = {}
var pluginList = app.fs.readdirSync(app.pluginPath);
pluginList.forEach(function (pluginFilename) {
    var pluginName = app.path.basename(pluginFilename, app.path.extname(pluginFilename)),
        pluginPath = app.path.join(app.pluginPath, pluginFilename);
    if (app.fs.existsSync(pluginPath) && app.fs.statSync(pluginPath).isFile()) {
        app.debug('Init: load plugin => ' + pluginFilename);
        require(pluginPath)(app);
    }
});

// Load all module files ===============================================================================================
const fs = require('fs');
var moduleList = fs.readdirSync(app.modulePath);
moduleList.forEach(function (moduleName) {
    app.debug('Init: load module => ' + moduleName);
    var modulePath = app.path.join(app.modulePath, moduleName),
        moduleControllerPath = app.path.join(modulePath, 'controller.js');
    if (moduleName != '.' && fs.statSync(modulePath).isDirectory()) {
        if (fs.existsSync(moduleControllerPath) && fs.statSync(moduleControllerPath).isFile()) {
            require(moduleControllerPath)(app);
        }
    }
});

// Handling with errors ================================================================================================
//require('./src/config/error')(app);

// Testing =============================================================================================================

// Launch website ======================================================================================================
var port = process.env.PORT || 8078;
http.listen(port, function () {
    console.log('The website is online at: http://localhost:8078');
});
