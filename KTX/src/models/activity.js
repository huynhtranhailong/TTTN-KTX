module.exports = function(app) {
    const schema = app.db.Schema({
        id:                     String,
        name:                   String,
        abstract:               String,
        cover:                  String,
        category:               Number,
        location:               String,
        time: {
            start:              Date,
            end:                Date
        },
        interests: {
            score:              Number,
            days:               Number
        },
        created:                Date,
        creator:                {type : app.db.Schema.ObjectId, ref : 'user'},
        published:              {type: Boolean, default: true},
        allowExternal:          Boolean,
        participants: {
            internal:
                [
                    {
                        user: {type: app.db.Schema.ObjectId, ref: 'user'},
                        date: Date
                    }
                ],
            external:
                [
                    {
                        user: String,
                        date: Date
                    }
                ]
        },
        registers: {
            internal :
                [
                    {
                        user: {type: app.db.Schema.ObjectId, ref: 'user'},
                        date: Date
                    }
                ],
            external :
                [
                    {
                        user: {
                            id:             String,
                            phone:          String,
                            name: {
                                familyName: String,
                                givenName:  String
                            },
                            faculty:        String,
                            email:          String
                        },
                        date: Date
                    }
                ]
        },
        accepted :
            [
                {
                    user: String,
                    date: Date
                }
            ]
    });

    const Activity = app.db.model('activity', schema);

    const underscore = require('underscore');

    app.model.Activity = {
        createOne: function (activity, done) {
            let thisActivity = new Activity(activity);

            thisActivity.save(function (err, activity) {
                if (err) done({status: -1, error: err});
                else done({status: 1, activity: activity});
            })
        },
        getIdByCategory: function (category, done) {
            Activity.find({category: category}, function (err, activities) {
                if (err) return done({status: -1, error: err});
                const id = new Date().getFullYear().toString().substr(-2) + category + ("00" + activities.length).slice(-3) ;
                done({status: 1, id: id});
            })
        },
        updateOne: function (id, info, done) {
            Activity.findOne({id: id}, function (err, activity) {
                if (err) return done({status: -1, error: err});
                if (!activity) return done({status: 0});

                activity = underscore.extend(activity, info);

                activity.save(function (err, activity) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, activity: activity});
                })
            })
        }
        ,
        getById: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const id                = args.shift();
            const attributes        = args.shift();
            // =========================================================================================================

            let query = Activity.findOne({id: id})
                .populate('creator')
                .populate('participants.internal.user')
                .populate('registers.internal.user')
                .populate('accepted');

            if (attributes)
                query.select(attributes);

            query.exec(function (err, activity) {
                if (err) done({status: -1, error: err});
                else done({status: 1, activity: activity});
            });
        }
        ,
        getByIdForUpdate: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const id                = args.shift();
            const attributes        = args.shift();
            // =========================================================================================================

            let query = Activity.findOne({id: id});

            if (attributes)
                query.select(attributes);

            query.exec(function (err, activity) {
                if (err) done({status: -1, error: err});
                else done({status: 1, activity: activity});
            });
        }
        ,
        getAll: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const attributes        = args.shift();
            // =========================================================================================================

            let query = Activity.find({}).sort({created : -1})
                .populate('creator')
                .populate('participants.internal.user')
                .populate('registers.internal.user')
                .populate('accepted');

            if (attributes)
                query.select(attributes);

            query.exec(function (err, activities) {
                if (err) done({status: -1, error: err});
                else done({status: 1, activities: activities});
            });
        }
    }
};