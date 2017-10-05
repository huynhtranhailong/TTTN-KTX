module.exports = function(app) {
    let passport = require('passport');

    let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    let config = {
        clientID: "760233128149-u9pvb8oh12s3sieaevc7lusnv4fbi7fq.apps.googleusercontent.com",
        clientSecret: "vL_yt-ilh0r2DjQznrGFv0xC",
        callbackURL: "http://localhost:8078/auth/google/callback"
    };

    app.use(passport.initialize());

    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new GoogleStrategy(config,
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if(profile._json.domain == "hcmut.edu.vn"){
                  let id =  profile.emails[0].value.split('@')[0];
                  let info = {
                      avatarUrl: profile._json.image.url,
                      email: profile.emails[0].value,
                      name: profile.name,
                      id  : id
                  };
                  app.model.User.authenticate(info, function (message) {
                      switch (message.status)
                      {
                          case 1:
                              return done(null, {userInfo: message.user, checkedIn: null});
                              break;
                          case -1:
                              return done(message.error);
                              break;
                          case 0:
                              return done(null, false);
                              break;

                      }
                  });
                }
                else {
                  return done(null,false);
                }

            })
        }
    ));

    app.get('/auth/google',
            function (req, res, next) {
                if (!req.session.redirectUrl)
                    req.session.redirectUrl = req.query.redirect;
                next();
            },
            passport.authenticate('google', { scope: ['profile', 'email'], prompt : "select_account" })
        );

    app.get('/auth/google/callback',
            passport.authenticate('google', {failureRedirect: '/auth/google' }),
            function (req, res) {
                if (req.session.redirectUrl)
                    res.redirect(req.session.redirectUrl);
                else res.redirect('/dashboard');
            }
        );

    app.get('/logout',
            function (req, res) {
                req.logout();
                res.redirect('/');
            }
        );

    app.authentication = {
        isAuthenticated: function(req, res, next) {
            if (req.isAuthenticated())
            {
                delete req.session.redirectUrl;
                return next();
            }
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelOneUser: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role === 1)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role !== 1)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelOneUserOrUpper: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role >= 1)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role < 1)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelTwoUser: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role === 2)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role !== 2)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelTwoUserOrUpper: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role >= 2)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role < 2)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelThreeUser: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role === 3)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role !== 3)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelThreeUserOrUpper: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role >= 3)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role < 3)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelFourUser: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role === 4)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role !== 4)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isLevelFourUserOrUpper: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role >= 4)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role < 4)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        },
        isUser: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role <= 4)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && req.user.userInfo.role > 4)
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        }
        ,
        isAdmin: function (req, res, next) {
            if (req.isAuthenticated() && req.user.userInfo.role === 5)
            {
                delete req.session.redirectUrl;
                return next();
            }
            else if (req.isAuthenticated() && (req.user.userInfo.role !== 5))
                res.redirect('/error/404/back=' + encodeURIComponent(req.originalUrl || req.url));
            else res.redirect('/auth/google?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        }
    };

};
