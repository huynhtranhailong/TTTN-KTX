module.exports = function(app) {
    app.get('/login',
        function (req, res) {
            res.render('../module/authentication/view.pug', {
                pageTitle: app.title,
                message: req.flash('message')
            });
    })
};