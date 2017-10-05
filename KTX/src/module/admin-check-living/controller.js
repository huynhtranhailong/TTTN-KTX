module.exports = function(app) {

    const moment = require("moment");
    const Excel = require("exceljs");

    app.get('/admin/xetduyetluutru', app.authentication.isAdmin,
        function (req, res) {
            app.model.Config.getAll(function (result) {
                const configsRegister = result.configs.filter(x=> x.registerTime.length != 0);
                app.model.Register.getById(configsRegister[0].registerTime[0].listUserRegister,function (currentUser) {
                    res.render('../module/admin-check-living/view.pug', {
                        pageTitle: app.title,
                        session: (req.user) ? req.user.userInfo : null,
                        configsRegister : configsRegister,
                        currentUser: currentUser.register
                    });
                })
            });
        });

    app.post('/admin/createSemeter', app.authentication.isAdmin, function (req,res) {
        app.model.Config.createOne(function (result) {
            res.send(result)
        })
    })

    app.get('/admin/currentSemester/', app.authentication.isAdmin, function (req,res) {
        app.model.Config.getCurrentSemester(function (result) {
            res.send(result);
        })
    })

    app.post('/admin/getReglist',app.authentication.isAdmin, function (req,res) {
        var data = req.body;
       app.model.Register.getById(data.registerList, function (result) {
           res.send(result.register)
       })
    })

    app.post('/admin/updateReglist',app.authentication.isAdmin, function (req,res) {
        var data = req.body;
        app.model.Register.updateStatus(data, function (result) {
            res.send(result);
        })
    })

    app.post('/admin/viewInfo',app.authentication.isAdmin, function (req,res) {
        var data = req.body;
        app.model.Register.getById(data.registerId, function (result) {
            var ress = result.register.listUser.filter(function(val) {return val._id == data.rowId})
            res.send(ress[0].user);
        })
    })

    app.post('/admin/confirmStay',app.authentication.isAdmin, function (req,res) {
        var data = req.body;
        app.model.Register.finishChecking(data.data, function (result) {
            res.send(result);
        })
    })

    app.post('/admin/exportFile',app.authentication.isAdmin, function (req,res) {
        var data = req.body;
        app.model.Register.getById(data.data, function (result) {
            console.log(result.register);
            var workbook = new Excel.Workbook();
            var worksheet = workbook.addWorksheet('Register');

            worksheet.columns = [
                { header: 'STT', key: 'index', width: 5 },
                { header: 'MSSV', key: 'id', width: 10 },
                { header: 'Họ và tên lót', key: 'familyName', width: 32 },
                { header: 'Tên', key: 'givenName', width: 14 },
                { header: 'Giới tính', key: 'gender', width: 10 },
                { header: 'Ngày sinh', key: 'birthday', width: 20 },
                { header: 'Ngày đăng ký', key: 'date', width: 20 },
                { header: 'Tình trạng', key: 'isCheck', width: 10 },
            ];
            var users = result.register.listUser.map(function (x,index) {
                worksheet.addRow({
                    index: index,
                    id: x.user.id,
                    familyName: x.user.name.familyName,
                    givenName: x.user.name.givenName,
                    gender: x.user.details.gender ? 'Name' : 'Nữ',
                    birthday: x.user.details.birthday,
                    date: x.date,
                    isCheck: (x.status==1) ? 'Đã xét duyệt' : (x.status==0) ? 'Đang chờ duyệt' : 'Không duyệt',
                });
            });

            var tempFilePath = 'public/document/sample/export_temp.xlsx';
            workbook.xlsx.writeFile(tempFilePath).then(function() {
                console.log('file is written');
                res.send({status: 1, link: '/admin/download/export_temp.xlsx'});
            });
        })
    })

    app.get('/admin/download/export_temp.xlsx', function (req, res) {
        res.download(app.publicPath + '/document/' + 'sample/export_temp.xlsx','danhsach.xlsx')
    })
};