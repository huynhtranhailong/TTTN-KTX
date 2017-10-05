module.exports = function(app) {

    app.get('/admin/document/view', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.Document.getAll(function (message) {
                if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.render('../module/admin-document-view/view.pug', {
                        pageTitle: app.title,
                        session: req.user.userInfo,
                        documents: message.documents,
                    });
            })
        });
    app.get("/admin/document/downloadFile/:name/:originalname" , app.authentication.isLevelThreeUserOrUpper , function (req,res) {
        const name = req.params.name;
        const originalname = req.params.originalname;
        var path = app.publicPath + '/document/file/' + name ;
        res.download(path,originalname.toString(), function (message) {
        })
    })
};