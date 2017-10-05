module.exports = function(app) {

    const async = require('async');

    const schema = app.db.Schema({
        title: {
            tonal:          String,
            imtonal:        String
        },
        url:                String,
        abstract :          String,
        cover:              String,
        categories:         String,
        isHot:              Boolean,
        created:            Date,
        creator:            {type: app.db.Schema.ObjectId, ref: 'user'},
        content:            String,
        published:          {type: Boolean, default: true},
        views :             {type: Number, default: 0}
    });


    const News = app.db.model('news', schema);

    const underscore = require('underscore');

    app.model.News = {
        createOne : function (news, done) {
            let thisNews = new News(news);

            thisNews.save(function (err, news) {
                if (err) done({status: -1, error: err});
                else done({status: 1, news: news});
            })
        }
        ,
        updateOne: function (id, alternative, done) {
            News.findById(id, function (err, news) {
                if (err) return done({status: -1, error: err});
                if (!news) return done({status: 0});

                news = underscore.extend(news, alternative);

                news.save(function (err, news) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, news: news});
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

            let query = News.findById(id).populate('creator');

            if (attributes)
                query.select(attributes);

            query.exec(function (err, news) {
                if (err) done({status: -1, error: err});
                else done({status: 1, news: news});
            });
        },
        getAll: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const attributes        = args.shift();
            // =========================================================================================================

            let query = News.find({}).sort({created: -1}).populate('creator');

            if (attributes)
                query.select(attributes);

            query.exec(function (err, news) {
                if (err) done({status: -1, error: err});
                else done({status: 1, news: news});
            });
        },
        toggleHot: function (id, done) {
            News.findById(id).exec(function (err, news) {
                if (err) return done({status: -1, error: err});
                if (!news) return done({status: 0});

                news.isHot = !(news.isHot);

                news.save(function (err, news) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, news: news});
                })
            })
        },
        togglePublish: function (id, done) {
            News.findById(id).exec(function (err, news) {
                if (err) return done({status: -1, error: err});
                if (!news) return done({status: 0});

                news.published = !(news.published);

                news.save(function (err, news) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, news: news});
                })
            })
        },
        getByPage: function(data, done) {
            if(data.created != ''){
                var conditions = {
                    created : { $ne: new Date(parseInt(data.created))},
                    published: true,
                    categories : data.categories
                };
            }else{
                var conditions = {
                    published: true,
                    categories : data.categories
                };
            }

            var skipNumber = (parseInt(data.pageNumber) - 1) * parseInt(data.pageSize);
            News.find(conditions).sort({_id: -1}).skip(skipNumber).limit(parseInt(data.pageSize)).exec(function (error, data) {
                if (error) throw error;

                var data = {status : 1 ,news: data};
                done(data);
            });

        }
    }
};