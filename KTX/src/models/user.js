module.exports = function(app) {

    const schema = app.db.Schema({
        id:                     String,
        email:                  String,
        avatarUrl:              String,
        role:                   {type: Number, default:1},
        black: {
            value:              {type: Boolean, default: false},
            proposer:           [{type: app.db.Schema.ObjectId, ref: 'user'}]
        },
        firstAuthentication:    {type: Boolean, default: true},
        name: {
            familyName:         String,
            givenName:          String
        },
        details: {
            class:              String,
            grade:              Number,
            major:              Number,
            phone:              String,
            email:              String,
            birthday:           Date,
            gender:             Boolean,
            birthplace:         String,
            ethnicity:          String,
            religion:           String,
            permanentAddress: {
                details:        String,
                communeId:      String
            },
            temporaryAddress: {
                details:        String,
                communeId:      String,
            },
            identityCard: {
                id:             String,
                date:           Date,
                place:          String
            },
        },
        status : Boolean
    });

    const User = app.db.model('user', schema);

    const async = require('async');

    const underscore = require('underscore');

    app.model.User = {
        createOne: function (info, done) {
            User.findOne({email: info.email}, function (err, user) {
                if (err) done({status: -1, error: err});
                else {
                    if (user) done({status: 0});
                    else {
                        let user = new User(info);

                        user.save(function (err, user) {
                            if (err) done({status: -1, error: err});
                            else done({status: 1, user: user});
                        });
                    }
                }
            })
        }
        ,
        createMany: function (infos, done) {
            async.mapSeries(infos,
                function (info, callback) {
                    app.model.User.createOne(info, function (message) {
                        callback(null, message)
                    })
                }
                ,
                function (err, results) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, users: results});
                }
            )
        }
        ,
        changeRoleOne: function (id, role, done) {
            User.findById(id, function (err, user) {
                if (err) return done({status: -1, error: err});
                if (!user) return done({status: 0});

                user.role = role;

                user.save(function (err, user) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, user: user});
                });
            })
        },
        changeRoleMany: function (ids, role, done) {
            console.log(ids);
            async.mapSeries(ids, function (id, callback) {
                app.model.User.changeRoleOne(id, role, function (message) {
                    callback(null, message);
                })}
                , function (err, users) {
                    if (err) return done({status: -1, error: err});
                    return done({status: 1, users: users});
                });
        },
        updateOne: function (info, done) {
            User.findOne({id: info.id}, function (err, user) {
                if (err) return done({status: -1, error: err});
                if (!user) return done({status: 0});

                user.name = info.name;
                user.details = underscore.extend(user.details, info.details);

                user.save(function (err, user) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, user: user});
                });
            })
        }
        ,
        editClassOne: function (idAndClass, done) {
            User.findOne({id: idAndClass.id}, function (err, user) {
                if (err) return done({status: -1, error: err});
                if (!user) return done({status: 0});

                user.details.class = idAndClass.class;
                user.details.grade = idAndClass.grade;
                user.details.major = idAndClass.major;

                user.save(function (err, user) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, user: user});
                });
            })
        }
        ,
        editClassMany: function (idsAndClasses, done) {
            async.mapSeries(idsAndClasses,
                function (idAndClass, callback) {
                    app.model.User.editClassOne(idAndClass, function (message) {
                        callback(null, message);
                    })
                }
                ,
                function (err, results) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, users: results});
                }
            )
        }
        ,
        authenticate: function (info, done) {
            User.findOne({email: info.email}, function (err, user) {
                if (err) done({status: -1, error: err});
                else {
                    if (!user) {
                      let user = new User(info);

                      user.save(function (err, user) {
                          if (err) done({status: -1, error: err});
                          else done({status: 1, user: user});
                      });
                    }
                    else {
                        user.avatarUrl = info.avatarUrl;

                        if (user.firstAuthentication)
                        {
                            user.name = info.name;
                            user.firstAuthentication = false;
                        }

                        user.save(function (err, user) {
                            if (err) done({status: -1, error: err});
                            else done({status: 1, user: user});
                        })
                    }
                }
            })
        },
        getById: function (id, done) {
            User.findOne({id: id}).populate('black.proposer').exec(function (err, user) {
                if (err) done({status: -1, error: err});
                else {
                    done({status: 1, user: user});
                }
            })
        },
        getAll:function(done){
            User.find({}).sort({id: 1}).populate('black.proposer').exec(function (err, users) {
                if (err) done({status: -1, error: err});
                else {
                    done({status: 1,users: users});
                }
            })
        }
    };
};
