module.exports = function(app) {

    const async = require('async');

    const schema = app.db.Schema({
        activity:               {type: app.db.Schema.ObjectId, ref: 'activity'},
        user:                   {type: app.db.Schema.ObjectId, ref: 'user'},
        value:                  Number,
        description:            String,
        evaluated: [
            {
                modified :              Date,
                evaluator:              {type: app.db.Schema.ObjectId, ref: 'user'},
            }
        ]
    });

    const Score = app.db.model('score', schema);
    app.model.Score = {
        markOne : function (data, evaluator, done) {
            Score.findOne({user: data.user, activity: data.activity}, function(err, score){
                if (score)
                {
                    score.evaluated.push({
                        evaluator: evaluator,
                        modified: new Date()
                    });
                    score.value = data.value;
                    score.description = data.description;

                    score.save(function (err, newScore) {
                        if (err) done({status: -1, error: err});
                        else done({status: 1, score: newScore});
                    })
                }
                else {
                    let thisScore = new Score(data);
                    thisScore.evaluated = [{
                        evaluator: evaluator,
                        modified: new Date()
                    }];

                    thisScore.save(function (err, score) {
                        if (err) done({status: -1, error: err});
                        else done({status: 1, score: score});
                    })
                }
            })

        },
        markMany: function (scores, evaluator, done) {
            async.mapSeries(scores,
                function (score, callback) {
                    app.model.Score.markOne(score, evaluator, function (message) {
                        callback(null, message)
                    })
                }
                ,
                function (err, results) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, scores: results});
                }
            )
        },
        getByActivity: function (activity, done) {
            Score.find({activity: activity}).populate('activity').populate('user').populate('evaluated.evaluator')
                .exec(function (err, scores) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, scores: scores});
                });
        },
        getByUser: function (user, done) {
            Score.find({user: user}).populate('activity').populate('user').populate('evaluated.evaluator')
                .exec(function (err, scores) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, scores: scores});
                });
        },
        getAll: function (done) {
            Score.find({}).populate('activity').populate('user').populate('evaluated.evaluator')
                .exec(function (err, scores) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, scores: scores});
                });
        }
    }

}