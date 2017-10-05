module.exports = function(app) {

    const moment = require("moment");

    app.get('/tin-tuc/:created', function (req, res) {
        app.model.Config.getCurrentSemester(function (result) {
            if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
            app.model.News.getAll(function (message) {
                if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                res.render('../module/read-news/view.pug', {
                    news: message.news,
                    config : result.config,
                    created : req.params.created
                });
            });
        });
    });

    app.post('/getNewsPag', function (req,res) {
        app.model.News.getByPage(req.body,function (result) {
            res.send(result)
        })
    })
};