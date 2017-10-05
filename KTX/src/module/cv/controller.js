module.exports = function(app) {

    app.get('/cv/id=:id', app.authentication.isAuthenticated,
        function (req, res) {
            const id = req.params.id;
            const redirect = req.query.redirect;

            if (req.user.userInfo.id === id || req.user.userInfo.role >= 2)
            {
                app.model.User.getById(id, function (message) {
                    if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.render('../module/cv/view', {
                        pageTitle: app.title,
                        session: req.user.userInfo,
                        info: message.user,
                        redirect: redirect
                    });
                })
            }
            else return res.redirect('/error/404?redirect=' + encodeURIComponent(req.originalUrl || req.url));
        });

    app.post('/cv/update', app.authentication.isAuthenticated,
        function (req, res) {
            const redirect = req.headers.referer.substr(req.headers.origin.length);
            if ((req.user.userInfo.role <= 4 && req.user.userInfo.id === req.body.id) || req.user.userInfo.role === 5)
            {
                let info = req.body;

                info.details.birthday = app.plugins.ISODate.parse(info.details.birthday);

                info.details.identityCard.date = app.plugins.ISODate.parse(info.details.identityCard.date);

                if (info.details.birthday instanceof Date && info.details.identityCard.date instanceof Date)
                {
                    app.model.User.updateOne(info, function (message) {
                        if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(redirect));
                        return res.redirect(redirect);
                    })
                }
                else return res.redirect('/error/500?redirect=' + encodeURIComponent(redirect));
            }
            else return res.redirect('/error/404?redirect=' + encodeURIComponent(redirect));
        })
};
