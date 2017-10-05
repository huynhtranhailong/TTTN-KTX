module.exports = function(app) {

    app.get('/admin/tin-tuc/quan-ly', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.Config.getCurrentSemester(function (result) {
                if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                app.model.News.getAll(function (message) {
                    if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.render('../module/admin-news-publish/view.pug', {
                        pageTitle: app.title,
                        session: req.user.userInfo,
                        news: message.news,
                        config : result.config
                    });
                })
            })
        });


    app.post('/admin/news/edit',app.authentication.isLevelThreeUserOrUpper,
        function (req,res) {
            app.model.News.update(req.body, function(result){
                res.send(result);
            })

        }
    );

    app.get("/admin/news/togglePublish/id=:id", app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.News.getById(req.params.id, function (message) {
                if (message.status < 1) return res.send(message);

                const news = message.news;

                if (req.user.userInfo.role >= 4 || (req.user.userInfo.id === news.creator.id)) {
                    app.model.News.togglePublish(news._id, function (message) {
                        if (message.status < 1) return res.send(message);
                        res.send({status: 1, news: message.news});
                    })
                }
                else res.send({status: -2});
            })
        });

    app.get("/admin/news/toggleHot/id=:id", app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.News.getById(req.params.id, function (message) {
                if (message.status < 1) return res.send(message);

                const news = message.news;

                if (req.user.userInfo.role >= 4 || (req.user.userInfo.id === news.creator.id)) {
                    app.model.News.toggleHot(news._id, function (message) {
                        if (message.status < 1) return res.send(message);
                        res.send({status: 1, news: message.news});
                    })
                }
                else res.send({status: -2});
            })
        })



};