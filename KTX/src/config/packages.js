module.exports = function(app) {

    // Log every request to the console
    var morgan = require('morgan');
    //app.use(morgan('dev'));

    // Use connect-flash for flash messages stored in session
    var flash = require('connect-flash');
    app.use(flash());

    // Cryptography
    app.crypt = require('bcrypt-nodejs');

    // Moments
    app.locals.moment = require('moment');
    app.locals.moment.locale('vi');
    app.locals.underscore = require('underscore');

    // Get information from html forms
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Session
    var session = require('express-session');
    app.set('trust proxy', 1); // trust first proxy
    app.use(session({
        secret: 'BN1SPEAeeWywcEuxyh0hCcpPwumUx3hx1qJcLJGuYlRMcyrCdj71XZBBLO7I',
        resave: true,
        saveUninitialized: true
    }));

    // Read cookies (needed for auth)
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());

};