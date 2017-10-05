module.exports = function(app) {

    const moment = require("moment");

    app.get('/admin/modotluutru', app.authentication.isAdmin,
        function (req, res) {
                app.model.Config.getAll(function (result) {
                    const currentDate = new Date();
                    const configsCanCreate = result.configs.filter(x => x.semester.startDate > currentDate)
                    app.model.Config.getCurrentSemester(function (message) {
                            res.render('../module/admin-registerTime/view.pug', {
                                pageTitle: app.title,
                                session: (req.user) ? req.user.userInfo : null,
                                configs: result.configs,
                                configsCanCreate : configsCanCreate,
                                currentConfig: message.config,
                                error: req.flash('error'),
                                errorUpdate: req.flash('errorUpdate'),
                            });
                    })
                })

        });


    app.post('/admin/config/openRegisterTime', app.authentication.isAdmin, function (req, res) {
            let config = req.body;
            if (config.startDay.indexOf('_') >= 0 || config.endDay.indexOf('_') >= 0 || config.startTime.indexOf('_') >= 0 || config.endTime.indexOf('_') >= 0  ) {
                req.flash('error', 'Vui lòng điền đầy đủ ngày giờ')
                return res.redirect('/admin/modotluutru');
            }
            else {
                config.startDate = moment(config.startDay + ' ' + config.startTime, "DD/MM/YYYY HH:mm").format();
                config.endDate = moment(config.endDay + ' ' + config.endTime, "DD/MM/YYYY HH:mm").format();

                if (config.endDate <= config.startDate) {
                    req.flash("error", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
                    return res.redirect('/admin/modotluutru')
                }
                const currentDate = new Date();
                if(config.startDate < moment(currentDate,"DD/MM/YYYY HH:mm").format()){
                    req.flash("error", "Thời gian bắt đầu phải lớn hơn thời gian hiện tại");
                    return res.redirect('/admin/modotluutru')
                }


                const semester = config.semester.split("-");
                const year = semester[0];
                const value = semester[1];

                delete config.semester

                app.model.Config.createRegisterTime(year, value, config, function (result) {
                    return res.redirect('/admin/modotluutru')
                })
            }
    })

    app.post('/admin/config/updateRegisterTime', app.authentication.isAdmin, function (req, res) {
        let config = req.body;
        if (config.startDay.indexOf('_') >= 0 || config.endDay.indexOf('_') >= 0 || config.startTime.indexOf('_') >= 0 || config.endTime.indexOf('_') >= 0  ) {
            req.flash('error', 'Vui lòng điền đầy đủ ngày giờ')
            return res.redirect('/admin/modotluutru');
        }
        else {
            config.startDate = moment(config.startDay + ' ' + config.startTime, "DD/MM/YYYY HH:mm").format();
            config.endDate = moment(config.endDay + ' ' + config.endTime, "DD/MM/YYYY HH:mm").format();

            if (config.endDate <= config.startDate) {
                req.flash("error", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
                return res.redirect('/admin/modotluutru')
            }

            delete config.startDay
            delete config.endDay
            delete config.startTime
            delete config.endTime


            app.model.Config.updateRegisterTime(config, function (result) {
                return res.redirect('/admin/modotluutru')
            })

        }
    })

    app.post('/admin/config/deleteRegisterTime',app.authentication.isAdmin,function (req,res) {
        app.model.Config.deleteRegisterTime(req.body,function (result) {
            if(result.status == 1) res.redirect('/admin/modotluutru');
        })
    })

};