module.exports = function(app) {

    const moment = require("moment");

    app.get('/', function (req, res) {
        app.model.Config.getCurrentSemester(function (result) {
            if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
            app.model.News.getAll(function (message) {
                if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                res.render('../module/home/view.pug', {
                    news: message.news,
                    config : result.config
                });
            });
        });
    });
};