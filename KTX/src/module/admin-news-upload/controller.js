module.exports = function(app) {

    const tvkd = require('khong-dau');

    app.get('/admin/tin-tuc/dang-bai', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.Config.getCurrentSemester(function (result) {
                if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                app.model.Document.getAll(function (message) {
                    if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.render('../module/admin-news-upload/view.pug', {
                        pageTitle: app.title,
                        session: req.user.userInfo,
                        documents: message.documents,
                        config : result.config
                    });
                });
            });
        });

    app.post('/admin/news/create', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            let news = req.body;

            news.title.imtonal = tvkd(news.title.tonal.toLowerCase(), ["chuyen", "url"]);

            news.creator = req.user.userInfo._id;

            news.created = new Date();

            news.isHot = news.isHot === 'on';

            app.model.News.createOne(req.body, function (message) {
                if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                res.redirect('/admin/news/upload');
            })
        });


};