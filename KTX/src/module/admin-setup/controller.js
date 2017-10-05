module.exports = function(app) {

    const moment = require("moment");

    app.get('/admin/setup', app.authentication.isAdmin,
        function (req, res) {
                app.model.Config.getAll(function (result) {
                    app.model.Config.getCurrentSemester(function (message) {
                        app.model.News.getAll(function (data) {
                            let currentConfigSortByFloor
                            if(message.config){
                                currentConfigSortByFloor = message.config.floor.sort(function (a, b) {
                                    let textA = Number(a.name);
                                    let textB = Number(b.name);
                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                });
                            }
                            res.render('../module/admin-setup/view.pug', {
                                pageTitle: app.title,
                                session: (req.user) ? req.user.userInfo : null,
                                configs: result.configs,
                                currentConfig: message.config,
                                listNews : data.news,
                                error: req.flash('error'),
                                errorUpdate: req.flash('errorUpdate'),
                                activeDiv : req.flash("activeDiv"),
                                currentFloor : currentConfigSortByFloor
                            });
                        })

                    })
                })

        });
    // QUẢN LÝ HỌC KỲ

    app.post('/admin/semester/create', app.authentication.isAdmin, function (req, res) {
        app.model.Config.getAll(function (result) {
            let config = req.body;
            if (config.semester.startDate.indexOf('_') >= 0 || config.semester.endDate.indexOf('_') >= 0) {
                req.flash('error', 'Sai đinh dạng ngày')
                return res.redirect('/admin/setup');
            }
            else {
                if (config.semester.startDate != '') {
                    config.semester.startDate = moment(config.semester.startDate, "DD/MM/YYYY").format();
                } else {
                    req.flash('error', 'Vui lòng nhập  ngày bắt đầu')
                    return res.redirect('/admin/setup');
                }

                if (config.semester.endDate != '') {
                    config.semester.endDate = moment(config.semester.endDate, "DD/MM/YYYY").format();
                    if (config.semester.endDate <= config.semester.startDate) {
                        req.flash("error", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
                        return res.redirect('/admin/setup')
                    }
                }
                else
                    delete config.semester.endDate
                config.created = new Date();
                if (result.configs.length == 0) {
                    app.model.Config.createOne(config, function (result) {
                        if(result.status == 1) res.redirect('/admin/setup')
                    })
                } else {
                    // Tìm học kì bị trùng
                    const errorList = result.configs.filter(function (x) {
                        if (x.semester.endDate) {
                            if(config.semester.endDate){
                                if (moment(config.semester.endDate) < moment(x.semester.startDate) || moment(config.semester.startDate) > moment(x.semester.endDate)) return false
                                else return true
                            }
                            if (moment(x.semester.endDate) >= moment(config.semester.startDate)) return true
                            else return false
                        } else {
                            if(config.semester.endDate){
                                if (moment(config.semester.endDate) < moment(x.semester.startDate)) return false
                                else return true
                            }else{
                                if (moment(x.semester.startDate) >= moment(config.semester.startDate)) return true
                                else return false
                            }
                        }
                    })
                    if (errorList.length == 0) {
                        var configData = result.configs[0].toObject();
                        delete configData._id;
                        delete configData.registerTime;
                        configData.semester = config.semester;
                        configData.created = new Date();
                        app.model.Config.createOne(configData, function (result) {
                            return res.redirect('/admin/setup')
                        })
                    } else {
                        let messageError = "Trùng vào thời gian của ";
                        errorList.map(function (x) {
                            messageError += " học kì " + x.semester.value + " năm học " + x.semester.year + '-' + (parseInt(x.semester.year) + 1)
                            return
                        })
                        req.flash('error', messageError);
                        req.flash('div', 'semester');
                        return res.redirect('/admin/setup')

                    }
                }

            }
        })

    })

    app.post('/admin/semester/getNewSemesterValue', app.authentication.isAdmin, function (req,res) {
        app.model.Config.getAll(function (result) {
            const semesterOfYear = result.configs.filter(x=> x.semester.year == req.body.year)
            if(semesterOfYear.length == 0)
                res.send({value :  1});
            else
                res.send({value : (parseInt(semesterOfYear[0].semester.value) + 1)});
        })
    })

    app.post('/admin/semester/updateDate',app.authentication.isAdmin,function (req,res) {
        let config = req.body;
        if (config.semester.startDate.indexOf('_') >= 0 || config.semester.endDate.indexOf('_') >= 0) {
            req.flash('errorUpdate', 'Sai đinh dạng ngày')
            return res.redirect('/admin/setup');
        }
        else {
            if (config.semester.startDate != '') {
                config.semester.startDate = moment(config.semester.startDate, "DD/MM/YYYY").format();
            } else {
                req.flash('errorUpdate', 'Vui lòng nhập  ngày bắt đầu')
                return res.redirect('/admin/setup');
            }

            if (config.semester.endDate != '') {
                config.semester.endDate = moment(config.semester.endDate, "DD/MM/YYYY").format();
                if (config.semester.endDate <= config.semester.startDate) {
                    req.flash("errorUpdate", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
                    return res.redirect('/admin/setup')
                }
            }
            else
                delete config.semester.endDate
        }
        app.model.Config.getAll(function (result) {
            if (result.configs.length == 1) {
                app.model.Config.updateDate(config, function (result) {
                    if(result.status == 1) res.redirect('/admin/setup')
                })
            } else {
                // Tìm học kì bị trùng
                const errorList = result.configs.filter(function (x) {
                    if(x._id.toString() == config.id.toString()) return false
                    if (x.semester.endDate) {
                        if(config.semester.endDate){
                            if (moment(config.semester.endDate) < moment(x.semester.startDate) || moment(config.semester.startDate) > moment(x.semester.endDate)) return false
                            else return true
                        }
                        if (moment(x.semester.endDate) >= moment(config.semester.startDate)) return true
                        else return false
                    } else {
                        if(config.semester.endDate){
                            if (moment(config.semester.endDate) < moment(x.semester.startDate)) return false
                            else return true
                        }else{
                            if (moment(x.semester.startDate) >= moment(config.semester.startDate)) return true
                            else return false
                        }
                    }
                })
                if (errorList.length == 0) {
                    app.model.Config.updateDate(config, function (result) {
                        return res.redirect('/admin/setup')
                    })
                } else {
                    let messageError = "Trùng vào thời gian của ";
                    errorList.map(function (x) {
                        messageError += " học kì " + x.semester.value + " năm học " + x.semester.year + '-' + (parseInt(x.semester.year) + 1)
                        return
                    })
                    req.flash('errorUpdate', messageError);
                    req.flash('div', 'semester');
                    return res.redirect('/admin/setup')

                }
            }
        })
    });

    // HẾT QUẢN LÝ HỌC KỲ

    // QUẢN LÝ DANH MỤC

    const KhongDau = require('khong-dau');
    app.get('/admin/categories/create/:name' ,app.authentication.isLevelThreeUserOrUpper, function (req,res) {
        var currentDate = new Date();
        const name = req.params.name;
        id = KhongDau(name.toLowerCase(), ["chuyen", "url"])
        var data = {id: id , name : name , created : currentDate , published : true };
        app.model.Config.getCurrentSemester(function (message) {
            app.model.Config.createCategories(message.config , data , function (message) {
                res.send(message);
            })
        })
    })
    app.get('/admin/categories/changePublished/:id',app.authentication.isLevelThreeUserOrUpper,function (req,res) {
        app.model.Config.getCurrentSemester(function (message) {
            app.model.Config.updateCategoriesPublished(message.config , req.params.id , function (message) {
                res.send(message);
            })
        })
    })
    app.post('/admin/categories/changeName/:id/:name',app.authentication.isLevelThreeUserOrUpper,function (req,res) {
        var nameNew = req.params.name;
        var idNew  = KhongDau(nameNew.toLowerCase(), ["chuyen", "url"]);
        var data = { nameNew : nameNew , idNew : idNew};
        app.model.Config.getCurrentSemester(function (message) {
            app.model.Config.updateCategoriesName(message.config , req.params.id , data ,function (message) {
                res.send(message);
            })
        })
    })

    // HẾT QUẢN LÝ DANH MỤC

    //QUẢN LÝ MENU

    app.get('/admin/menu/getNews',app.authentication.isAdmin, function (req,res) {
        app.model.News.getAll(function (result) {
            if(result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
            const news = result.news.filter(x=> x.categories == "0");
            res.send({news : news});
        })
    })

    app.post('/admin/menu/createParent', app.authentication.isAdmin, function (req,res) {
        let menu = req.body.menu;
        if(menu.link == "")
            delete menu.link
        app.model.Config.createParentMenu(req.body.configId,menu,function (result) {
            req.flash("activeDiv", "menu");
            res.redirect("/admin/setup")
        })
    })

    app.post('/admin/menu/createChildren', app.authentication.isAdmin, function (req,res) {
        let menu = req.body.menu;
        if(menu.link == "")
            delete menu.link
        app.model.Config.createChildrenMenu(req.body.configId,req.body.menuId,menu,function (result) {
            req.flash("activeDiv", "menu");
            res.redirect("/admin/setup")
        })
    })

    app.post('/admin/menu/editParent', app.authentication.isAdmin, function (req,res) {
        let menu = req.body.menu;
        if(menu.link == "")
            delete menu.link
        app.model.Config.editParentMenu(req.body.configId,req.body.menuId,menu,function (result) {
            req.flash("activeDiv", "menu");
            res.redirect("/admin/setup")
        })
    })

    app.post('/admin/menu/editChildren', app.authentication.isAdmin, function (req,res) {
        let menu = req.body.menu;
        if(menu.link == "")
            delete menu.link
        app.model.Config.editChildrenMenu(req.body.configId,req.body.menuId,menu,function (result) {
            req.flash("activeDiv", "menu");
            res.redirect("/admin/setup")
        })
    })

    app.post('/admin/menu/deleteParent', app.authentication.isAdmin, function (req,res) {
        app.model.Config.deleteParentMenu(req.body.configId,req.body.menuId,function (result) {
            req.flash("activeDiv", "menu");
            res.redirect("/admin/setup")
        })
    })

    app.post('/admin/menu/deleteChildren', app.authentication.isAdmin, function (req,res) {
        app.model.Config.deleteChildrenMenu(req.body.configId,req.body.menuId,function (result) {
            req.flash("activeDiv", "menu");
            res.redirect("/admin/setup")
        })
    })
    //HẾT QUẢN LÝ MENU


    //QUẢN LÝ TRANG LIÊN KẾT
    app.post('/admin/linkedSite/create', app.authentication.isAdmin, function (req,res) {
        var data = req.body;
        app.model.Config.getCurrentSemester(function (result) {
            var configId = result.config._id;
            app.model.Config.newLinkedSite(configId, data, function (message) {
                res.send(message);
            })
        })
    });

    app.post('/admin/linkedSite/update', app.authentication.isAdmin, function (req,res) {
        var data = req.body;
        app.model.Config.getCurrentSemester(function (result) {
            var configId = result.config._id;
            app.model.Config.updateLinkedSite(configId, data.data, function (message) {
                res.send(message);
            })
        })
    });

    app.get('/admin/currentSemester/', app.authentication.isAdmin, function (req,res) {
        app.model.Config.getCurrentSemester(function (result) {
            res.send(result);
        })
    })

    app.post('/admin/linkedSite/uploadImage',app.authentication.isAdmin,
        app.plugins.Upload.singleByDestination('/temp'),function (req,res) {
            app.plugins.Image.minimizeOne(req.file, "/document/image", 800, 60, function (message) {
                if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                const document = {
                    name : message.file,
                    originalname : req.file.originalname,
                    created : Date.now(),
                    creator : req.user.userInfo,
                    published : true,
                    cover : message.cover,
                    type : 'image'
                }
                app.model.Document.saveOne(document, function (message) {
                    if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    app.fs.unlinkSync(req.file.path);
                    res.send(message)
                })
            });
    })
    //  HẾt QUẢN LÝ TRANG LIÊN KẾT

    // QUẢN LÝ GIƯỜNG
    //chi start
    //addfloor
    app.post('/admin/setup/addFloor', app.authentication.isAdmin , function (req, res) {
        let floorName = req.body.floorName.toUpperCase();
        let id = req.body.id;
        app.model.Config.addFloor(id, floorName, function (message) {
            if (message.status == 1) {
                res.redirect('/admin/setup')
            } else {
                res.send(message2.error);
            }
        })
    });
    //removeFloor
    app.post('/admin/setup/removeFloor', app.authentication.isAdmin, function (req, res) {
        let floor = req.body.floors;
        let configId = req.body.configId;
        app.model.Config.removeFloor(floor, configId, function (message) {
            if(message.status == 1){
                res.redirect('/admin/setup')
            }
        })
    });
    //addRoom
    app.post('/admin/setup/addRoom', app.authentication.isAdmin, function (req, res) {
        let floor = req.body.floors;
        let id = req.body.id;
        let roomType = req.body.roomType ? req.body.roomType : "" ;
        let roomName = req.body.roomName.toUpperCase();
        app.model.Config.addRoom(floor, id, roomType, roomName, function (message) {
            if(message.status == 1){
                res.redirect('/admin/setup');
            }
        })
    })
    //removeRoom
    app.post('/admin/setup/removeRoom', app.authentication.isAdmin, function (req, res) {
        let floor = req.body.floors;
        let configId = req.body.configId;
        let room = req.body.rooms;
        app.model.Config.removeRoom(floor, configId, room, function (message) {
            if(message.status == 1){
                res.redirect('/admin/setup');
            }
        })
    });
    //addBed
    app.post('/admin/setup/addBed', app.authentication.isAdmin, function (req, res) {
        let floor = req.body.floors;
        let id = req.body.id;
        let room = req.body.rooms;
        let bedName = req.body.bedName.toUpperCase();
        app.model.Config.addBed(floor, id, room, bedName,  function (message) {
            if(message.status == 1){
                res.redirect('/admin/setup');
            }
        })
    })
    //removebed
    app.post('/admin/setup/removeBed', app.authentication.isAdmin, function (req, res) {
        let floor = req.body.floors;
        let configId = req.body.configId;
        let room = req.body.rooms;
        let bed = req.body.beds;
        app.model.Config.removeBed(floor, configId, room, bed,  function (message) {
            if(message.status == 1){
                res.redirect('/admin/setup');
            }
        })
    })

    // QUẢN LÝ LOẠI PHÒNG
    app.get('/admin/roomType/create/:name' ,app.authentication.isLevelThreeUserOrUpper, function (req,res) {
        var currentDate = new Date();
        const name = req.params.name;
        var data = { name : name , created : currentDate , published : true };
        app.model.Config.getCurrentSemester(function (message) {
            app.model.Config.createRoomType(message.config , data , function (message) {
                res.send(message);
            })
        })
    })
    app.get('/admin/roomType/changePublished/:_id',app.authentication.isLevelThreeUserOrUpper,function (req,res) {
        app.model.Config.getCurrentSemester(function (message) {
            app.model.Config.updatePublishedOfRoomType(message.config , req.params._id , function (message) {
                res.send(message);
            })
        })
    })

    app.post('/admin/roomType/changeName/:_id/:name/:nameRoomType',app.authentication.isLevelThreeUserOrUpper,function (req,res) {
        var nameNew = req.params.name;
        app.model.Config.getCurrentSemester(function (message) {
            app.model.Config.updateNameOfRoomType(message.config , req.params._id , nameNew ,req.params.nameRoomType,function (message) {
                res.send(message);
            })
        })
    })
};