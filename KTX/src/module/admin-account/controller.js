module.exports = function(app) {

    const validator = require('validator');

    const underscore = require('underscore');

    app.get('/admin/account', app.authentication.isAdmin,
        function (req, res) {
            app.model.User.getAll(function(result) {
                res.render('../module/admin-account/view.pug', {
                    pageTitle: app.title,
                    session: req.user.userInfo,
                    users: result.users,
                    acceptedAddByFileMessage : req.flash('acceptedAddByFileMessage'),
                    addByFileMessage : req.flash('addByFileMessage')
                });
            });
    });

    app.post('/admin/account/create', app.authentication.isAdmin,
        function (req, res) {
            const emails = req.body.email.split('\r\n');
            const infos = emails.map(email => {
                if (email.indexOf('@') > -1 && email.indexOf("@hcmut.edu.vn") < 0)
                    return null;
                else return Object({
                    email: email.indexOf("@hcmut.edu.vn") > -1 ? email : email + "@hcmut.edu.vn",
                    id: email.indexOf("@hcmut.edu.vn") > -1 ? email.split("@")[0] : email,
                    role: 1,
                    details: {
                        grade: validator.isNumeric(email.split('@')[0]) ? (email.charAt(0) === '5' ? Number(email.substr(1, 2)) : Number(email.substr(0, 2))) : 0
                    },
                    status : 0
                });
            }).filter(x => x !== null);

            app.model.User.createMany(infos, function (message) {
                if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                return res.redirect('/admin/account');
            })
        });

    app.post('/admin/account/role/change', app.authentication.isAdmin,
        function (req, res) {
            const ids = underscore.flatten([req.body.ids]);
            const role = req.body.role;
            app.model.User.changeRoleMany(ids, role, function (message) {
                if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                return res.redirect('/admin/account');
            });
        })
};