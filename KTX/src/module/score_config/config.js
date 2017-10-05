module.exports = function(app) {
    var moment = require('moment');
    var room = new app.db.Schema({
        name : String,
        type : String,
        bed : [{
            name : String,
            user : {type : app.db.Schema.ObjectId, ref : 'user'}
        }]
    })
    var schema = app.db.Schema({
        semester: {
            year: String,
            value: Number,
            startDate: Date,
            endDate: Date
        },
        registerTime :[
            {
                startDate : Date,
                endDate : Date,
                description : String,
                listUserRegister : {type : app.db.Schema.ObjectId, ref : 'register'}
            }
        ],
        roomType: [
            {
                name: String,
                created : Date,
                published : Boolean
            }
        ],
        standards: [
            {
                id: String,
                name: String,
                maxScore: String
            }
        ],
        priors: [
            {
                id: String,
                name: String
            }
        ],
        services: [
            {
                id: String,
                name: String
            }
        ],
        classify: [
            {
                id: String,
                name: String
            }
        ],
        faculty: [
            {
                id: String,
                name: String
            }
        ],

        menu: [
            {
                name: String,
                link: String,
                child: [ Object ({
                    name: String,
                    link: String })]
            }
        ],
        scoreConfig:[
            {
                name: String,           //Tên của tiêu chí A
                scoreMin: Number,       //Điểm min của tiêu chí A
                scoreMax: Number,       //Điểm max của tiêu chí A
                date: [Date],           //Ngày tạo mới hoặc chỉnh sửa
                child: [Object({        //Tiêu chí con của tiêu chí A
                    name: String,       //Tên tiêu chí con của A là A1
                    scoreMin: Number,       //Điểm min của tiêu chí A1
                    scoreMax: Number,       //Điểm max của tiêu chí A1
                })]
            }
        ]
        ,
        newsType: [
            {
                id: String,
                name: String,
                published : Boolean,
                created : Date
            }
        ],
        linkedSite: [
            {
                id: String,
                img: String,
                link: String,
                content: String,
                created: Date,
                published : Boolean
            }
        ],
        created:    Date,
        floor: [{
            name : String,
            roomList : [room]
        }]
    });

    const Config = app.db.model('config', schema);
    app.model.Config = {
        createOne: function (data,done) {
            let thisConfig = new Config(data);
            thisConfig.save(function (err, config) {
                if (err) done({status: -1, error: err});
                else{
                    Config.findOne({'semester.year' : config.semester.year, 'semester.value': (config.semester.value-1)},function (err, semesterBefore) {
                        if(semesterBefore){
                            if(!semesterBefore.semester.endDate){
                                semesterBefore.semester.endDate = moment(config.semester.startDate).subtract(1,'day');
                                semesterBefore.save(function (err, semesterBefore) {
                                    if (err) done({status: -1, error: err});
                                    return done({status: 1, config: config});
                                })
                            }else{
                                return done({status: 1, config: config});
                            }
                        }else return done({status: 1, config: config});
                    })
                }
            });
        },
        getCurrentSemester : function (done) {
            Config.find({},function (err, configs) {
                if(configs.length == 1){
                    return done({status :1, config : configs[0]})
                }else{
                    const config = configs.find(function (x) {
                        const date = new Date();
                        if(x.semester.endDate){
                            if(x.semester.endDate >= date && x.semester.startDate <= date)
                                return true
                            else{
                                return false
                            }
                        }else{
                            if(x.semester.startDate <= date) return true
                            else return false
                        }

                    })
                    if(config){
                        return done({status :1, config : config})
                    }

                    else
                    {
                        const date = new Date();

                        const config = configs.reduce(function (curr, config) {
                            let hours = Math.abs(moment(config.semester.startDate).diff(moment(date)))
                            if(config.semester.endDate){
                                let hour1 = Math.abs(moment(config.semester.endDate).diff(moment(date)))
                                if( hour1 < hours)
                                    hours = hour1
                            }

                            let currDiff = Math.abs(moment(curr.semester.startDate).diff(moment(date)))
                            if(curr.semester.endDate){
                                let currDiff1 = Math.abs(moment(curr.semester.endDate).diff(moment(date)))
                                if( currDiff1 < currDiff)
                                    currDiff = currDiff1
                            }

                            if(hours < currDiff)
                                curr = config
                            return curr;

                        },configs[0])
                        return done({status:1, config : config})
                    }
                }

            })
        },
        getAll: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const attributes        = args.shift();
            // =========================================================================================================

            let query = Config.find({}).sort({ 'semester.year' : -1, 'semester.value' : -1 })
            if (attributes)
                query.select(attributes);

            query.exec(function (err, configs) {
                if (err) done({status: -1, error: err});
                else done({status: 1, configs: configs});
            });
        },
        // Update Semester Date
        updateDate: function (newConfig,done) {
            Config.findById(newConfig.id,function (err, config) {
                config.semester = newConfig.semester;
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },
        // end Update SemsterDate

        // For Categories
        createCategories : function (config,dataCatagori ,  done) {
            const i = config.newsType.length;
            console.log(dataCatagori.id);
            Config.findOne({_id: config._id} , function (err , configCurrent) {
                const type = configCurrent.newsType;
                const check = type.filter(x=>x.id == dataCatagori.id)
                //check categories exis
                if(check.length == 0){
                    console.log(configCurrent.newsType);
                    configCurrent.newsType.push(dataCatagori)

                    configCurrent.save(function (err , configdata) {
                        console.log('lol');
                        if (err) done({status: -1, error: err});
                        else done({status: 1, configdata: configdata});
                    })
                }
                else{
                    done({status : -1})
                }

            })
            // console.log(configCurrent);

        },
        updateCategoriesPublished : function (config,id , done) {
            Config.findOne({_id: config._id} , function (err , configCurrent) {
                console.log(configCurrent._id);
                console.log(configCurrent.newsType);
                console.log(id);
                const type = configCurrent.newsType;
                let i = 0;
                type.map(function (x) {
                    if(x.id == id){
                        if(configCurrent.newsType[i].published == true ){
                            configCurrent.newsType[i].published = false
                            configCurrent.save(function (err , configdata) {
                                console.log('lol');
                                if (err) done({status: -1, error: err});
                                else done({status: 1, configdata: configdata});
                            })
                        }
                        else {
                            configCurrent.newsType[i].published = true;
                            configCurrent.save(function (err , configdata) {
                                console.log('lol');
                                if (err) done({status: -1, error: err});
                                else done({status: 1, configdata: configdata});
                            })
                        }

                    }
                    i++;
                })
            })
            //
        },
        updateCategoriesName : function (config, id ,data, done) {
            Config.findOne({_id: config._id} , function (err , configCurrent) {
                const type = configCurrent.newsType;
                let i = 0;
                const check = type.filter(x=>x.id == data.idNew);
                //check name categori
                if( check[0].id === id || check.length == 0 ){
                    type.map(function (x) {
                        if (x.id == id) {
                            configCurrent.newsType[i].name = data.nameNew;
                            configCurrent.newsType[i].id = data.idNew;
                            configCurrent.save(function (err, configdata) {
                                if (err) done({status: -1, error: err});
                                else done({status: 1, configdata: configdata});
                            })
                        }
                        i++;
                    })
                }
                //check exist name catagories
                else {
                    done({status : -1});
                }
            })
        },
        //End Categories

        //Menu
        createParentMenu: function (configId,menu,done) {
            Config.findById(configId,function (err, config) {
                config.menu.push(menu);
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },
        createChildrenMenu: function (configId,menuId,menu,done) {
            Config.findById(configId,function (err, config) {
                let i = 0;
                config.menu.map(function (x) {
                    if(x._id.toString() == menuId)
                        config.menu[i].child.push(menu);
                    else i++;
                })
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },
        editParentMenu: function (configId,menuId,menu,done) {
            Config.findById(configId,function (err, config) {
                let i = 0;
                config.menu.map(function (x) {
                    if(x._id.toString() == menuId)
                    {
                        config.menu[i].name = menu.name;
                        config.menu[i].link = menu.link;
                    }

                    else i++;
                })
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },
        editChildrenMenu: function (configId,menuId,menu,done) {
            Config.findById(configId,function (err, config) {
                let menuIndex = 0;
                config.menu.map(function (x) {
                    let childIndex = 0;
                    x.child.map(function (child) {
                        if(child._id.toString() == menuId)
                        {
                            config.menu[menuIndex].child[childIndex].name = menu.name;
                            config.menu[menuIndex].child[childIndex].link = menu.link;
                        }
                        else
                            childIndex++;
                    })
                    menuIndex++;

                })
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },
        deleteParentMenu: function (configId,menuId,done) {
            Config.findById(configId,function (err, config) {
                let i = 0;
                let index = 0;
                config.menu.map(function (x) {
                    if(x._id.toString() == menuId)
                    {
                        index = i;
                    }

                    else i++;
                })
                config.menu.splice(index,1);
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },
        deleteChildrenMenu: function (configId,menuId,done) {
            Config.findById(configId,function (err, config) {
                let i = 0;
                let index = 0;
                let menuIndex = 0;
                let parentDelete = 0;
                let childrenDelete = 0
                config.menu.map(function (x) {
                    let childIndex = 0;
                    x.child.map(function (child) {
                        if (child._id.toString() == menuId) {
                            parentDelete =menuIndex;
                            childrenDelete = childIndex;
                        }
                        else
                            childIndex++;
                    })
                    menuIndex++;
                })
                config.menu[parentDelete].child.splice(childrenDelete,1);
                config.save(function (err,config) {
                    if(err) throw err;
                    return done({status :1 , config : config})
                })
            })
        },

        // Trang liên kết
        newLinkedSite: function (configId, data, done) {
            Config.findOne({_id: configId}, function (err, configs) {
                if (err) done({status: -1, error: err});
                else {
                    if (!configs) done({status: 0})
                    else {
                        data.created = new Date();
                        data.published = true;
                        configs.linkedSite.push(data);
                        configs.save(function (err, config) {
                            if (err) done({status: -1,error: err});
                            else done({status: 1, config: config});
                        })
                    }
                }
            })
        },
        updateLinkedSite: function (configId, data, done) {
            Config.findOne({_id: configId}, function (err, configs) {
                if (err) done({status: -1, error: err});
                else {
                    if (!configs) done({status: 0})
                    else {
                        configs.linkedSite = data;
                        configs.save(function (err, config) {
                            console.log(config)
                            if (err) done({status: -1,error: err});
                            else done({status: 1, config: config});
                        })
                    }
                }
            })
        },
        //Hết trang liên kết

        // Mở đợt dăng kí lưu trú

        createRegisterTime: function (year,value,data,done) {
            Config.findOne({'semester.year' : year, 'semester.value' :value},function (err,config){
                app.model.Register.createOne(function(result){
                    data.listUserRegister = result.register._id;
                    config.registerTime.unshift(data);
                    config.save(function (err, config) {
                        if (err) done({status: -1, error: err});
                        return done({status: 1, config: config})
                    })
                })
            })
        },
        updateRegisterTime: function (data,done) {
            Config.findById(data.configId,function (err,config) {
                const arrIndex = config.registerTime.length - parseInt(data.index);
                config.registerTime[arrIndex].startDate = data.startDate;
                config.registerTime[arrIndex].endDate = data.endDate;
                config.save(function (err, config) {
                    if (err) done({status: -1, error: err});
                    return done({status: 1, config: config})
                })

            })
        },
        deleteRegisterTime: function (data,done) {
            Config.findById(data.configId,function (err,config) {
                const arrIndex = config.registerTime.length - parseInt(data.index);
                app.model.Register.removeById(config.registerTime[arrIndex].listUserRegister,function (result) {
                    if(result.status == 1){
                        config.registerTime.splice(arrIndex,1);
                        config.save(function (err, config) {
                            if (err) done({status: -1, error: err});
                            return done({status: 1, config: config})
                        })
                    }else{
                        if (err) done({status: -1, error: result.err});
                    }
                })

            })
        },
        //chi start
        addFloor: function (id, floorName, done) {
            Config.findById(id, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    config.floor.push({name: floorName});
                    config.save(function (err2) {
                        if(err2) done({status: 0, error: err2});
                        else done({status: 1});
                    })
                }
            })
        },
        removeFloor: function (floor, created, done) {
            Config.findOne({created: created}, function (err, config) {
                if(!err){
                    let index = config.floor.findIndex(x=> x.id == floor);
                    config.floor.splice(index, 1);
                    config.save(function (err2) {
                        if(!err2) done({status: 1});
                        else done({status: 0, error: err2});
                    })
                } else done({status:0, error: err});
            })
        },
        addRoom: function (floor, id, roomType, roomName, done) {
            Config.findById(id, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    console.log(floor);
                    let floorIndex = config.floor.findIndex(x=>x._id == floor);
                    console.log(floorIndex)
                    console.log(config.floor[floorIndex].roomList);
                    const data = {type : roomType, name : roomName};
                    config.floor[floorIndex].roomList.push(data);
                    config.save(function (err2) {
                        if(err2) done({status: 0, error: err2});
                        else done({status: 1});
                    })
                }
            })
        },
        removeRoom: function (floor, created, room, done) {
            Config.findOne({created: created}, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let floorIndex = config.floor.findIndex(x=>x.id == floor);
                    let roomIndex = config.floor[floorIndex].roomList.findIndex(y=> y.id == room);
                    config.floor[floorIndex].roomList.splice(roomIndex, 1);
                    config.save(function (err2) {
                        if(err2) done({status: 0, error: err2});
                        else done({status: 1});
                    })
                }
            })
        },
        addBed: function (floor, id, room, bedName, done) {
            Config.findById(id, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let floorIndex = config.floor.findIndex(x=>x._id.toString() == floor);
                    let roomIndex = config.floor[floorIndex].roomList.findIndex(y=> y._id.toString() == room);
                    config.floor[floorIndex].roomList[roomIndex].bed.push({ name: bedName});
                    config.save(function (err2) {
                        if(err2) done({status: 0, error: err2});
                        else done({status: 1});
                    })
                }
            })
        },
        removeBed: function (floor, created, room, bed, done) {
            Config.findOne({created: created}, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let floorIndex = config.floor.findIndex(x=>x.id == floor);
                    let roomIndex = config.floor[floorIndex].roomList.findIndex(y=> y.id == room);
                    let bedIndex =  config.floor[floorIndex].roomList[roomIndex].bed.findIndex(z=>z.id == bed);
                    config.floor[floorIndex].roomList[roomIndex].bed.splice(bedIndex, 1);
                    config.save(function (err2) {
                        if(err2) done({status: 0, error: err2});
                        else done({status: 1});
                    })
                }
            })
        }
        ,
        //score config
        createCriteria: function (configId, criteria, scoreMin, scoreMax, done) {
            Config.findById(configId, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    config.scoreConfig.push({name: criteria, scoreMin: scoreMin, scoreMax: scoreMax, date: [new Date()]});
                    config.save(function (err) {
                        if(err) done({status: 0, error: err});
                        else done({status: 1, config: config});
                    })
                }
            })
        }
        ,
        createSubCriteria: function(configId, criteriaId, criteria, scoreMin, scoreMax, done){
            Config.findById(configId, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let index = config.scoreConfig.findIndex(x => x._id == criteriaId);
                    config.scoreConfig[index].date.push(new Date());
                    config.scoreConfig[index].child.push({name: criteria, scoreMin: scoreMin, scoreMax: scoreMax});
                    config.save(function (err) {
                        if(err) done({status: 0, error: err});
                        else done({status: 1, config: config});
                    })
                }
            })
        }
        ,
        editCriteria: function(configId, criteriaId, criteria, scoreMin, scoreMax, done){
            Config.findById(configId, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let index = config.scoreConfig.findIndex(x => x._id == criteriaId);
                    config.scoreConfig[index].date.push(new Date());
                    config.scoreConfig[index].name = criteria;
                    config.scoreConfig[index].scoreMin = scoreMin;
                    config.scoreConfig[index].scoreMax = scoreMax;
                    config.save(function (err) {
                        if(err) done({status: 0, error: err});
                        else done({status: 1, config: config});
                    })
                }
            })
        }
        ,
        editSubCriteria: function(configId, criteriaId, subCriteriaId, criteria, scoreMin, scoreMax, done){
            Config.findById(configId, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let index = config.scoreConfig.findIndex(x => x._id == criteriaId);
                    let index2 = config.scoreConfig[index].child.findIndex(x => x._id == subCriteriaId);
                    config.scoreConfig[index].date.push(new Date());
                    config.scoreConfig[index].child[index2].name = criteria;
                    config.scoreConfig[index].child[index2].scoreMin = scoreMin;
                    config.scoreConfig[index].child[index2].scoreMax = scoreMax;
                    config.save(function (err) {
                        if(err) done({status: 0, error: err});
                        else done({status: 1, config: config});
                    })
                }
            })
        }
        ,
        deleteCriteria: function(configId, criteriaId, done){
            Config.findById(configId, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let index = config.scoreConfig.findIndex(x => x._id == criteriaId);
                    config.scoreConfig.splice(index, 1);
                    config.save(function (err) {
                        if(err) done({status: 0, error: err});
                        else done({status: 1, config: config});
                    })
                }
            })
        }
        ,
        deleteSubCriteria: function(configId, criteriaId, subCriteriaId, done){
            Config.findById(configId, function (err, config) {
                if(err) done({status: 0, error: err});
                else{
                    let index = config.scoreConfig.findIndex(x => x._id == criteriaId);
                    let index2 = config.scoreConfig[index].child.findIndex(x => x._id == subCriteriaId);
                    config.scoreConfig[index].child.splice(index2, 1);
                    config.scoreConfig[index].date.push(new Date());
                    config.save(function (err) {
                        if(err) done({status: 0, error: err});
                        else done({status: 1, config: config});
                    })
                }
            })
        }
    }

}