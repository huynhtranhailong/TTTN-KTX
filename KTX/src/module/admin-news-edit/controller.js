module.exports = function(app) {

    const underscore = require('underscore');

    app.get('/admin/tin-tuc/chinh-sua/id=:id', app.authentication.isLevelFourUserOrUpper,
        function (req, res) {
            app.model.Config.getCurrentSemester(function (result) {
                if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));

                app.model.Document.getAll(function (message) {
                    if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    const documents = message.documents;
                    app.model.News.getById(req.params.id, function (message) {
                        if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                        if (message.status === 0) return res.redirect('/error/404?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                        const news = message.news;

                        if (req.user.userInfo.role >= 4 || (req.user.userInfo.id === news.creator.id)) {
                            res.render('../module/admin-news-edit/view.pug', {
                                pageTitle: app.title,
                                session: req.user.userInfo,
                                documents: documents,
                                news: news,
                                config : result.config
                            });
                        }
                        else return res.redirect('/error/404?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    })
                })
            });
        });
    app.post('/admin/news/edit', app.authentication.isLevelFourUserOrUpper,
        function (req, res) {
            app.model.News.getById(req.body._id, function (message) {
                if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                if (message.status === 0) return res.redirect('/error/404?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                const news = message.news;

                if (req.user.userInfo.role >= 4 || (req.user.userInfo.id === news.creator.id)) {
                    app.model.News.updateOne(req.body._id, req.body, function (message) {
                        if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                        if (message.status === 0) return res.redirect('/error/404?redirect=' + encodeURIComponent(req.originalUrl || req.url));

                        res.redirect('/admin/tin-tuc/quan-ly');
                    })
                }
                else return res.redirect('/error/404?redirect=' + encodeURIComponent(req.originalUrl || req.url));
            })
        }
    )
};