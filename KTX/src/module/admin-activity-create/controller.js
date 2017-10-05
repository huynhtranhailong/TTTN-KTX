module.exports = function(app) {

    const moment = require('moment');

    app.get('/admin/activity/create', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.Activity.getIdByCategory(1, function (message) {
                if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                const id = message.id;
                app.model.Document.getAll(function (message) {
                    if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    const images = message.images;
                    res.render('../module/admin-activity-create/view.pug', {
                        pageTitle: app.title,
                        session: req.user.userInfo,
                        id: id,
                        images: images
                    });
                });
            })

        });

    app.post('/admin/activity/id/get', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.Activity.getIdByCategory(Number(req.body.category), function (message) {
                res.send(message);
            })
        });

    app.post('/admin/activity/create', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
            app.model.Activity.getIdByCategory(Number(req.body.category), function (message) {
                if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));

                const id = message.id;

                let activity = req.body;

                activity.id = id;
                activity.allowExternal = activity.allowExternal === 'on';
                activity.creator = req.user.userInfo._id;
                activity.created = new Date();
                activity.time = {};
                if (activity["time-type"] === 'single') {
                    if (activity.date.indexOf('_') >= 0 || activity.startTime.indexOf('_') >= 0 || activity.endTime.indexOf('_') >= 0) return res.redirect('/error/400?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    activity.time.start = moment(activity.date + " " + activity.startTime, "DD/MM/YYYY HH:mm").format();
                    activity.time.end = moment(activity.date + " " + activity.endTime, "DD/MM/YYYY HH:mm").format();
                }
                else if (activity["time-type"] === 'multiple') {
                    if (activity.startDate.indexOf('_') >= 0 || activity.endDate.indexOf('_') >= 0) return res.redirect('/error/400?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    activity.time.start = moment(activity.startDate, "DD/MM/YYYY").format();
                    activity.time.end = moment(activity.endDate, "DD/MM/YYYY").format();
                }

                delete activity["time-type"];
                delete activity["date"];
                delete activity["startTime"];
                delete activity["endTime"];
                delete activity["startDate"];
                delete activity["endDate"];

                app.model.Activity.createOne(activity, function (message) {
                    if (message.status === -1) return res.redirect('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.redirect('/admin/activity/create');
                })
            });
        })


};