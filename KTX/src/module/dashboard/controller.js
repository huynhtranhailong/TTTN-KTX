module.exports = function(app) {

    var menu =
        [
            {icon: "home", name: "Trang chủ", active: true, href: "/dashboard"},
            {icon: "perm_identity", name: "Sơ yếu lý lịch", active: false, href: "/dashboard/cv"}
        ]

    app.get('/dashboard', app.authentication.isAuthenticated,
        function (req, res) {
            res.render('../module/dashboard/view.pug', {
                pageTitle: app.title,
                menu: menu,
                session: req.user.userInfo,
            })

        });

    app.get('/location/get/latlng=:lat,:lng', app.authentication.isAuthenticated,
        function (req, res) {
            if (req.user.checkedIn === null || new Date().getTime - req.user.checkedIn.getTime() >= 600000)
            {
                let position = {
                    lat: req.params.lat,
                    lng: req.params.lng,
                    time: new Date()
                }

                app.model.Location.savePosition(req.user.userInfo.email, position, function (message) {
                    res.send(message);
                })
            }
        });

    app.post('/dashboard/admin/account/createOne',app.authentication.isAuthenticated,
        function (req,res) {
            app.model.User.createOne(req.body.id,req.body.name, function(result){
                res.send(result);
            })
        })
};
