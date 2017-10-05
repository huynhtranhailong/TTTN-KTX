var selectNews = '<select class="form-control selectNews" name="menu[link]" ><option></option>';
var news;
$(document).ready(function () {

    $.get('/admin/menu/getNews',{},function (data) {
        news = data.news;
        data.news.map(function (x) {
            var date = new Date(x.created)
            selectNews += '<option value="/tin-tuc/' + date.getTime() + '">' + x.title.tonal + '</option>';
        })
        selectNews += '</select>';
    })
    $('.tree').treegrid();
    $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
    activeTab('tab-floor');

    $("#tableRoomType").DataTable( {
        responsive: true,
        pageLength: 50,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        }
    });

    // QUẢN LÝ HỌC KÌ
    $("select[name='semester[year]']").change(function () {
        var data = {year : $("select[name='semester[year]']").val()}
        $.post('/admin/semester/getNewSemesterValue',data,function (result) {
            $("input[name='semester[value]']").val(result.value);
        })
    })


    // HẾT QUẢN LÝ HỌC KÌ

    // QUẢN LÝ CHUYÊN MỤC
    // QUẢN LÝ CHUYÊN MỤC
    $("#categoriesTable").DataTable( {
        responsive: true,
        pageLength: 50,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        }
    });
    $(".newCatagories").click(function () {
        var $this = $(this);
        $.confirm({
            title: 'TẠO CHUYÊN MỤC MỚI',
            content: '' +
            '<form action=""  class="formName">' +
            '<div class="form-group">' +
            '<label>Bạn có chắc chắn muốn tạo chuyên mục mới ?</label>' +
            '<input type="text" placeholder="Tên chuyên mục" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Có',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if (!name) {
                            $.alert('Vui lòng nhập tên chuyên mục');
                            return false;
                        }
                        $.get('/admin/categories/create/'+ name , function (message) {
                            if(message.status == 1){
                                $.alert('Tạo thư mục thành công');
                                var index = message.index +1
                                var content = '<tr data-id="' + message.catagories[0]._id + '" role="row" class="odd">' +
                                    '<td class="text-center sorting_1"> ' + index+ '</td>' +
                                    '<td class="text-center"><a href="'+ message.catagories[0].id +'">'+ message.catagories[0].name+'</a></td>' +
                                    '<td class="text-center">'+ message.created +'</td><td class="text-center">0</td>'+
                                    '<td class="text-center">Chưa có bài đăng nào</td>'+
                                    '<td class="text-center"><a class="glyphicon glyphicon-star" onclick="changeCategoriesPublished(&quot;'+message.catagories[0].id +'&quot;,&quot;'+ message.catagories[0]._id +'&quot;)"></a><a class="glyphicon glyphicon-pencil" style="margin-left : 5px;" onclick="changeCategoriesName(&quot;' + message.catagories[0]._id + '&quot; , &quot;'+message.catagories[0].id+'&quot; , &quot;'+message.catagories[0].name+'&quot;)"></a></td>' +
                                    '</tr>';
                                $('#rowCatagories').append(content);
                            }
                            else{
                                $.alert('Tên thư mục đã tồn tại , vui lòng nhập tên khác !');
                            }

                        })
                    }
                },
                formCancel:{
                    text: 'Không',
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });


    // HẾT QUẢN LÝ CHUYÊN MỤC


    //QUẢN LÝ TRANG LIÊN KẾT

    $('#linkedsite tbody').sortable({
        update: function (event, ui) {
            $('tbody > tr .counter').each(function (index) {
                $(this).text(index + 1);
            });
        }
    });

    $('.newlinkedsite').click(function () {
        $.confirm({
            title: 'TẠO LIÊN KẾT/QUẢNG CÁO MỚI',
            content: '' +
            '<div class="form-group" id="create-link">' +
            //'<label>Nội dung liên kết</label>' +
            '<input type="text" placeholder="Nội dung liên kết" class="content form-control"/>' +
            //'<label> Đường dẫn </label>' +
            '<input type="text" placeholder="Đường dẫn" class="link form-control"/>' +
            '<input class="hidden" name="file_linkedSite" type="file" accept="image/*" />' +
            '<button id="photo_upload" class="btn btn-blue">Chọn Ảnh</button>' +
            '<img name="image_linkedSite" class="img-responsive" style="width: 300px; height: 200px; margin-top: 20px" src="">' +
            '<input name="imageName" class="img form-control" type="hidden" value="" />' +
            '</div>',
            buttons: {
                formSubmit: {
                    text: 'TẠO MỚI',
                    btnClass: 'btn-blue',
                    action: function () {
                        var content = this.$content.find('.content').val();
                        var link = this.$content.find('.link').val();
                        var img = this.$content.find('.img').val();
                        var data = {
                            link: link,
                            content: content,
                            img: img
                        }
                        if(!img){
                            $.alert('Hãy chọn hình ảnh!');
                            return false;
                        }
                        $.post('/admin/linkedSite/create', data , function (message) {
                            if(message.status == 1){
                                window.location='/admin/setup'
                            }
                            else $.alert('Tạo thất bại');
                        })
                    }
                },
                cancel: function () {
                    //close
                },
            },
            onContentReady: function () {
                // bind to events
                $('#photo_upload').click(function () {
                    $("input[name='file_linkedSite']").click();
                })
                $("input[name='file_linkedSite']").change(function () {
                    var formData = new FormData();
                    formData.append('file', $('input[name="file_linkedSite"]')[0].files[0]);

                    $.ajax({
                        url : '/admin/linkedSite/uploadImage',
                        type : 'POST',
                        data : formData,
                        processData: false,  // tell jQuery not to process the data
                        contentType: false,  // tell jQuery not to set contentType
                        success : function(data) {
                            if(data.status == 1){
                                $("img[name='image_linkedSite']").attr('src','/document/image/' + data.document.name);
                                $("input[name='imageName']").val(data.document.name);
                            }
                        }
                    });
                });

                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    })
    var changeData = false;
    $('.updateLinkedSite').click(function () {
        $.get('/admin/currentSemester',{}, function (result) {
            var currentLinkedSite = result.config.linkedSite;
            var data = new Array();
            $('#link-table tbody tr').each(function (index,row) {
                var $$row = $(row);
                var img = $$row.children().eq(1).children().eq(1).val();
                var link = $$row.children().eq(2).text();
                var content = $$row.children().eq(3).html();
                var created = $$row.children().eq(4).html();
                var prePub = $$row.children().eq(5).children().eq(0).children().eq(0);
                var publish = prePub.hasClass('glyphicon-star')? true : false
                data.push({ img :img,
                    link:link,
                    content:content,
                    created:parseDate(created),
                    published:publish})
            });
            $.each(currentLinkedSite, function (index, site) {
                if(site.link != data[index].link || site.content != data[index].content || site.published != data[index].published)
                {
                    changeData=true;
                }
            })
            if(changeData == true){
                $.post('/admin/linkedSite/update', {data : data} , function (message) {
                    if(message.status == 1){
                        window.location='/admin/setup'
                    }
                })
            }
            else {
                $.confirm({
                    title: 'Chưa có gì thay đổi',
                    content: ' ',
                    buttons: {
                        OK: function () {
                            //close
                        },
                    }
                })
            }

        })
    })

    // HẾT QUẢN LÝ TRANG LIÊN KẾT

    //QUẢN LÝ LOẠI PHÒNG
    $(".newRoomType").click(function () {
        var $this = $(this);
        $.confirm({
            title: 'TẠO LOẠI PHÒNG MỚI',
            content: '' +
            '<form action=""  class="formName">' +
            '<div class="form-group">' +
            '<label>Bạn có chắc chắn muốn tạo loại phòng mới ?</label>' +
            '<input type="text" placeholder="Tên loại phòng" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Có',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if (!name) {
                            $.alert('Vui lòng nhập tên loại phòng');
                            return false;
                        }
                        $.get('/admin/roomType/create/'+ name , function (message) {
                            if(message.status == 1){
                                var index = message.index +1
                                $.alert('Tạo loại phòng thành công');
                                var content = '<tr data-id="'+ message.roomType[0]._id +'">' +
                                    '<td class="text-center">'+ index +'</td>'+
                                    '<td class="text-center">'+ message.roomType[0].name +'</td>'+
                                    '<td class="text-center">'+ message.created +'</td>'+
                                    '<td class="text-center"><a href="#" onclick="showRoom(&quot;'+ message.roomType[0]._id +'&quot;,&quot;'+message.roomType[0].name+'&quot;)">0</a></td>'+
                                    '<td class="text-center"><a class="glyphicon glyphicon-star" onclick="changePublishedRoomType(&quot;'+message.roomType[0]._id+'&quot;)"></a><a class="glyphicon glyphicon-pencil" style="margin-left : 5px;" onclick="changeNameRoomType(&quot;'+message.roomType[0]._id+'&quot; , &quot;'+message.roomType[0].name+'&quot;)"></a></td>'+
                                    '</tr>'

                                $('#rowRoomType').append(content);
                            }
                            else{
                                $.alert('Lọai phòng đã tồn tại , vui lòng nhập tên khác !');
                            }
                        })
                    }
                },
                formCancel:{
                    text: 'Không',
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    })

})
function activeTab(tab){
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

// QUẢN LÝ HỌC KỲ

function editDate(id,startDate,endDate,semester,value) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'ĐIỀU CHỈNH THÔNG TIN CHO HỌC KỲ ' ,
        content: '' +
        '<p> Đang điều chỉnh thông tin cho học kỳ ' +  value + ' năm học '+ semester + '-' + (parseInt(semester)+1).toString() + '</p>' +
        '<form action="/admin/semester/updateDate" method="post" class="updateDate">' +
        '<div class="col-md-6">' +
        '<div class="form-group">' +
        '<b>Thời gian bắt đầu</b>' +
        '<div class="form-line">' +
        '<input class="form-control date" type="text" placeholder="DD/MM/YYYY" name="semester[startDate]" value="' + startDate +'"/>' +
        '</div></div></div>'+
        '<div class="col-md-6">' +
        '<div class="form-group">' +
        '<b>Thời gian kết thúc</b>' +
        '<div class="form-line">' +
        '<input class="form-control date" type="text" placeholder="DD/MM/YYYY" name="semester[endDate]" value="' + endDate +'"/>' +
        '<input name="id" type="text" class="hidden" value="' + id + '"/>' +
        '<input name="semester[year]" type="text" class="hidden" value="' + semester + '"/>' +
        '<input name="semester[value]" type="text" class="hidden" value="' + value + '"/>' +
        '</div></div></div>'+
        '</form>',
        buttons: {
            formSubmit: {
                text: 'ĐỒNG Ý',
                btnClass: 'btn-blue',
                action: function () {
                    $(".updateDate")[0].submit();
                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });

}

// HẾT QUẢN LÝ HỌC KỲ

// QUẢN LÝ MENU

function addParentMenu(id) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'THÊM MENU CHÍNH',
        content: '<form class="addMenu" action="/admin/menu/createParent" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên menu</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="menu[name]" />' +
        '</div></div></div>' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Đường dẫn đến bài viết (nếu có)</b>' + selectNews +
        '<input class="form-control hidden" type="text"  name="configId" value="' + id + '"/>' +
        '</div></div></div></form>',
        buttons: {
            formSubmit: {
                text: 'THÊM',
                btnClass: 'btn-blue',
                action: function () {
                    $(".addMenu")[0].submit();
                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $(".selectNews").select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn bài viết'
                },
                allowClear: true
            });
        }
    });
}

function editParentMenu(configId,menuId,menuName,menuLink) {
    var selectString = '<select class="form-control selectNews" name="menu[link]" ><option></option>';
    news.map(function (x) {
        var date = new Date(x.created)
        var hrefString = '/tin-tuc/' + date.getTime();
        if(hrefString == menuLink){
            selectString += '<option value="' + hrefString + '" selected>' + x.title.tonal + '</option>';
        }else{
            selectString += '<option value="' + hrefString + '">' + x.title.tonal + '</option>';
        }

    })
    selectString += '</select>';
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'CHỈNH SỬA MENU CHÍNH',
        content: '<form class="editParentMenu" action="/admin/menu/editParent" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên menu</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="menu[name]" value="' + menuName +'" />' +
        '</div></div></div>' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Đường dẫn đến bài viết (nếu có)</b>' + selectString +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="menuId" value="' + menuId + '"/>' +
        '</div></div></div></form>',
        buttons: {
            formSubmit: {
                text: 'CHỈNH SỬA',
                btnClass: 'btn-blue',
                action: function () {
                    $(".editParentMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $(".selectNews").select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn bài viết'
                },
                allowClear: true
            });
        }
    });
}

function addChildrenMenu(configId, menuId) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'THÊM MENU PHỤ',
        content: '<form class="addChildrenMenu" action="/admin/menu/createChildren" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên menu</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="menu[name]" />' +
        '</div></div></div>' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Đường dẫn đến bài viết (nếu có)</b>' + selectNews +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="menuId" value="' + menuId + '"/>' +
        '</div></div></div></form>',
        buttons: {
            formSubmit: {
                text: 'THÊM',
                btnClass: 'btn-blue',
                action: function () {
                    $(".addChildrenMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $(".selectNews").select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn bài viết'
                },
                allowClear: true
            });
        }
    });
}

function editChildrenMenu(configId,menuId,menuName,menuLink) {
    var selectString = '<select class="form-control selectNews" name="menu[link]" ><option></option>';
    news.map(function (x) {
        var date = new Date(x.created)
        var hrefString = '/tin-tuc/' + date.getTime();
        if(hrefString == menuLink){
            selectString += '<option value="' + hrefString + '" selected>' + x.title.tonal + '</option>';
        }else{
            selectString += '<option value="' + hrefString + '">' + x.title.tonal + '</option>';
        }

    })
    selectString += '</select>';
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'CHỈNH SỬA MENU PHỤ',
        content: '<form class="editChildrenMenu" action="/admin/menu/editChildren" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên menu</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="menu[name]" value="' + menuName +'" />' +
        '</div></div></div>' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Đường dẫn đến bài viết (nếu có)</b>' + selectString +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="menuId" value="' + menuId + '"/>' +
        '</div></div></div></form>',
        buttons: {
            formSubmit: {
                text: 'CHỈNH SỬA',
                btnClass: 'btn-blue',
                action: function () {
                    $(".editChildrenMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $(".selectNews").select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn bài viết'
                },
                allowClear: true
            });
        }
    });
}

function deleteParentMenu(configId,menuId,menuName) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'XÓA MENU PHỤ',
        content: '<form class="deleteParentMenu" action="/admin/menu/deleteParent" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Bạn có chắc chắn muốn xóa </b>' + '<span class="col-red">' + " " + menuName + '</span>'  +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="menuId" value="' + menuId + '"/>' +
        '</div></div></form>',
        buttons: {
            formSubmit: {
                text: 'XÓA',
                btnClass: 'btn-blue',
                action: function () {
                    $(".deleteParentMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $(".selectNews").select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn bài viết'
                },
                allowClear: true
            });
        }
    });
}

function deleteChildrenMenu(configId,menuId,menuName) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'XÓA MENU PHỤ',
        content: '<form class="deleteChildrenMenu" action="/admin/menu/deleteChildren" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Bạn có chắc chắn muốn xóa </b>' + '<span class="col-red">' + " " + menuName + '</span>'  +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="menuId" value="' + menuId + '"/>' +
        '</div></div></form>',
        buttons: {
            formSubmit: {
                text: 'XÓA',
                btnClass: 'btn-blue',
                action: function () {
                    $(".deleteChildrenMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            $(".selectNews").select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn bài viết'
                },
                allowClear: true
            });
        }
    });
}
//HẾT QUẢN LÝ MENU

//QUẢN LÝ CHUYÊN MỤC

function changeCategoriesPublished(id,_id) {
    $.confirm({
        title: 'Thay đổi sử dụng chuyên mục!',
        content: 'Bạn có chắc chắn muốn thay đổi không ???',
        buttons: {
            confirm:  {
                text: 'Có',
                btnClass: 'btn-blue',
                action: function(){
                    $.get('/admin/categories/changePublished/'+ id , function (message) {
                        if(message.status == 1)
                        {
                            $.alert('Thay đổi thành công');
                            var $row = $('tr[data-id="' + _id + '"]');
                            var a = $row.children().eq(5).children().eq(0);
                            if(a.hasClass('glyphicon-star')){
                                a.removeClass("glyphicon-star")
                                a.addClass("glyphicon-star-empty")
                            }else{
                                a.removeClass("glyphicon-star-empty")
                                a.addClass("glyphicon-star")
                            }
                        }
                    })
                }
            },

            formCancel:{
                text: 'Không',
            },

        }
    });
}

function changeCategoriesName(_id,id , nameCatagori) {
    $.confirm({
        title: 'ĐỔI TÊN CHUYÊN MỤC ',
        content: '' +
        '<form action=""  class="formName">' +
        '<div class="form-group">' +
        '<label>Chuyên mục "' + nameCatagori + '". Bạn có chắc chắn muốn đổi tên chuyên mục này ?</label>' +
        '<input type="text" placeholder="Tên chuyên mục" class="name form-control" required />' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Có',
                btnClass: 'btn-blue',
                action: function () {
                    var name = this.$content.find('.name').val();
                    if (!name) {
                        return true;
                    }
                    $.post('/admin/categories/changeName/'+ id + '/' + name , function (message) {
                        if(message.status == 1)
                        {
                            $.alert('Đổi tên thành công');
                            var $row = $('tr[data-id="' + _id + '"]');
                            var a = $row.children().eq(1).children().eq(0);
                            a.html(name);
                        }
                        else{
                            $.alert('Tên bạn đổi đã tồn tại , vui lòng chọn tên khác');
                        }
                    })
                }
            },
            formCancel:{
                text: 'Không',
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
}

// HẾT QUẢN LÝ CHUYÊN MỤC

//QUẢN LÝ TRANG LIÊN KẾT
function isPublished(_id) {
    var $row = $('tr[data-id="' + _id + '"]');
    var i = $row.children().eq(5).children().eq(0).children().eq(0);
    if(i.hasClass('glyphicon-star')){
        i.removeClass("glyphicon-star")
        i.addClass("glyphicon-star-empty")
    }else{
        i.removeClass("glyphicon-star-empty")
        i.addClass("glyphicon-star")
    }
}

function editContent(_id,link,content) {
    $.confirm({
        title: 'Thay đổi liên kết/quảng cáo!',
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group" id="create-link">' +
        //'<label>Nội dung liên kết</label>' +
        '<input type="text" placeholder="Nội dung liên kết" class="content form-control"' + 'value="'+content +  '"/>' +
        //'<label> Đường dẫn </label>' +
        '<input type="text" placeholder="Đường dẫn" class="link form-control"' + 'value="' + link + '"/>' +
        '</div>' +
        '</form>',
        buttons: {
            confirm:  {
                btnClass: 'btn-blue',
                text: 'Có',
                action: function(){
                    var content = this.$content.find('.content').val();
                    var link = this.$content.find('.link').val();
                    var data = {
                        link: link,
                        content: content
                    }
                    var $row = $('tr[data-id="' + _id + '"]');
                    $row.children().eq(2).html(link);
                    //$row.children().eq(1).children().eq(1).val(link);
                    $row.children().eq(3).html(content);

                }
            },

            formCancel:{
                text: 'Không',
            },

        }
    });
}

function parseDate(dateString) {
    var dateArray = dateString.split('/');
    var result = new Date(dateArray[2], dateArray[1] - 1, dateArray[0])
    return isNaN(result.getTime()) ? null : result;
}

//thêm tầng
$("button[name='addFloor']").click(function () {
    $('#formAction').empty();
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var formAddFloor =  '<div class="col-sm-8 col-sm-push-2  border-all">'+
        '<form action="/admin/setup/addFloor" method="post" onsubmit="return validateAddFloor()">'+
        '<h5 style="text-align: center">Thêm tầng</h5>'+
        '<div class="form-group">'+
        '<label>Tên tầng </label>'+
        '<input type="text" name="floorName" required>'+
        '</div>'+
        '<div class="form-group align-center">'+
        '<input class="btn btn-primary form-control" type="submit" value="Thêm">'+
        '</div>'+
        '<input class="hidden" name="id" value='+currentConfig._id+ '>'+
        '</form>'+
        '</div>';
    $('#formAction').append(formAddFloor);
    $("select").selectpicker();
});

function validateAddFloor() {
    var floor = $("input[name='floorName']");
    if(floor.length > 0) {
        alert('Thêm tầng thành công.');
        return true;
    }else{
        alert('Chưa có tên tầng');
        return false;
    }

};
//hiển thị phòng khi nhấn vào tầng
function showRoomOfFloor() {
    $("#roomList").empty();
    $("#bedList").empty();
    var floor = event.target.value;
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    function isHaveFloor(element) {
        return element._id.toString() == floor;
    };
    var index = currentConfig.floor.findIndex(isHaveFloor);
    if(currentConfig.floor[index].roomList.length > 0) {
        var room='';
        var roomListSorted = currentConfig.floor[index].roomList.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        var temp = roomListSorted.map(function (x) {
            var name = x.name;
            room += '<div class="row clearfix">' +
                '<button class="form-control" style="box-shadow: none; background-color: #fff; border: none; color: blue; text-align: left"  name="roomList" value="'+floor+"-"+ x._id+'" onclick="showBedOfRoom()">PHÒNG '+name+
                '<i class="material-icons" style="vertical-align: sub; font-size: 100%;">chevron_right</i>'+
                '</button></div>';

        });
        $("#roomList").append(room);
    }
};
//hiển thị giường khi nhấn vào phòng
function showBedOfRoom() {
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    $("#bedList").empty();
    var floorAndRoom = event.target.value;
    var strArr = floorAndRoom.split('-');
    var floor = strArr[0];
    var room = strArr[1];

    function isHaveFloor(element) {
        return element._id.toString() == floor;
    };
    function isHaveRoom(element) {
        return element._id.toString() == room;
    }
    var floorIndex = currentConfig.floor.findIndex(isHaveFloor);
    var roomIndex = currentConfig.floor[floorIndex].roomList.findIndex(isHaveRoom);
    if(currentConfig.floor[floorIndex].roomList[roomIndex].bed.length > 0) {
        var bedSorted = currentConfig.floor[floorIndex].roomList[roomIndex].bed.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var bed='';
        var temp = bedSorted.map(function (x) {
            var name = x.name;
            bed += '<div class="row clearfix">' +
                '<button class="form-control" style="box-shadow: none; text-align: left; background-color: #fff; border: none;"  name="roomList" value="'+x._id+'">GIƯỜNG '+name+
                '</button></div>';

        });
        $("#bedList").append(bed);
    }
}
//xoá tầng
$("button[name='removeFloor']").click(function () {
    $('#formAction').empty();
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    if(currentFloors.length == 0){
        alert('Chưa có tầng nào trong hệ thống')
    } else {
        var formRemoveFloor = '<div class="col-sm-8 col-sm-push-2  border-all">'+
            '<form action="/admin/setup/removeFloor" method="post">'+
            '<h5 style="text-align: center">Xoá tầng</h5>'+
            '<div class="form-group">' +
            '<label>Chọn tầng</label>'+
            '<select class="form-control" name="floors">';
        var floorSorted = currentFloors.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        var temp = floorSorted.map(function (x) {
            formRemoveFloor += '<option value='+x._id+'> TẦNG '+x.name + '</option>';
        });
        formRemoveFloor +=    '</select>'+
            '</div>'+
            '<div class="form-group align-center">'+
            '<input class="btn btn-primary form-control" type="submit" value="Xoá">'+
            '</div>'+
            '<input class="hidden" name="configId" value='+currentConfig._id+ '>'+
            '</form>'+
            '</div>';
    }
    $('#formAction').append(formRemoveFloor);
    $("select").selectpicker();
});
//thêm phòng
$('button[name="addRoom"]').click(function () {
    $('#formAction').empty();
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    if(currentFloors.length == 0){
        alert('Chưa có tầng nào trong hệ thống')
    } else {
        var formAddRoom = '<div class="col-sm-8 col-sm-push-2  border-all">'+
            '<form action="/admin/setup/addRoom" method="post" onsubmit="return validateAddRoom()">'+
            '<h5 style="text-align: center">Thêm phòng</h5>'+
            '<div class="form-group">' +
            '<label>Chọn tầng</label>'+
            '<select class="form-control" name="floors">';
        var floorSorted = currentFloors.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var temp = floorSorted.map(function (x) {
            formAddRoom += '<option value="'+x._id+'">TẦNG '+x.name + '</option>';
        });
        formAddRoom +=    '</select>'+
            '</div>'+
            '<div class="form-group">'+
            '<label>Tên Phòng </label>'+
            '<input type="text" name="roomName"/>'+
            '</div>'+
            '<div class="form-group">' +
            '<label>Loại phòng </label>'+
            '<select class="form-control" name="roomType"  >';
        currentConfig.roomType.map(function (x) {
            formAddRoom += '<option value="' + x._id +  '">' + x.name + '</option>'
        });
        formAddRoom += '</select>'+
            '</div>'+
            '<div class="form-group align-center">'+
            '<input class="btn btn-primary form-control" type="submit" value="Thêm">'+
            '</div>'+
            '<input class="hidden" name="id" value='+currentConfig._id + '>'+
            '</form>'+
            '</div>';
    }
    $('#formAction').append(formAddRoom);
    $("select").selectpicker();
});
function validateAddRoom() {
    var name = $("input[name='roomName']").val();
    if(name.length <= 0){
        alert('Tên phòng không được trống.');
        return false;
    }else {
        alert('Thêm tầng thành công.');
        return true;
    }
}
//xoá phòng
$('button[name="removeRoom"]').click(function () {
    $('#formAction').empty();
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    if(currentFloors.length == 0){
        alert('Chưa có tầng nào trong hệ thống')
    } else {
        var formRemoveRoom = '<div class="col-sm-8 col-sm-push-2  border-all">'+
            '<form action="/admin/setup/removeRoom" method="post" onsubmit="return validateRemoveRoom()">'+
            '<h5 style="text-align: center">Xoá phòng</h5>'+
            '<div class="form-group">' +
            '<label>Chọn tầng</label>'+
            '<select class="form-control" name="floors" onchange="optionOfSelectRoom(this)">';
        var floorSorted = currentFloors.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        var temp = floorSorted.map(function (x) {
            formRemoveRoom += '<option value="'+x._id+'" >TẦNG '+x.name +'</option>';
        });
        formRemoveRoom +=    '</select>'+
            '</div>'+
            '<div class="form-group">' +
            '<label>Chọn phòng</label>'+
            '<div id="selectRoom">'+
            '<select class="form-control" name="rooms"  >';
        if(currentFloors[0].roomList.length == 0){
            formRemoveRoom+= '<option value=""></option>';
        }else {
            var roomSorted = currentFloors[0].roomList.sort(function (a, b) {
                var textA = Number(a.name);
                var textB = Number(b.name);
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            var temp2 = roomSorted.map(function (y) {
                formRemoveRoom+= '<option value="'+y._id+'">PHÒNG '+y.name+'</option>';
            })
        }
        formRemoveRoom+= '</select>'+
            '</div>'+
            '</div'+
            '<div class="form-group align-center">'+
            '<input class="btn btn-primary form-control" type="submit" value="Xoá"/>'+
            '</div>'+
            '<input class="hidden" name="configId" value='+currentConfig._id+ '>'+
            '</form>'+
            '</div>';
    }
    $('#formAction').append(formRemoveRoom);
    $("select").selectpicker();
});
//đổi option select phòng khi xoá phòng hoặc thêm giường
function optionOfSelectRoom(floor) {
    var floor = floor.value;
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    function indexFloor(element) {
        return element._id == floor;
    }
    var index = currentFloors.findIndex(indexFloor);
    var selectRoomForm = '<select class="form-control" name="rooms">';
    if(currentFloors[index].roomList.length == 0){
        selectRoomForm+= '<option value=""></option>';
    }else {
        var roomSorted = currentFloors[index].roomList.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var temp2 = roomSorted.map(function (y) {
            selectRoomForm+= '<option value="'+y._id+'">PHÒNG '+y.name+'</option>';
        })
    }
    selectRoomForm += '</select>';
    $("#selectRoom").empty();
    $("#selectRoom").append(selectRoomForm);
}
function validateRemoveRoom() {
    alert('Xoá thành công.')
    return true;
}
//thêm giường
$('button[name="addBed"]').click(function () {
    $('#formAction').empty();
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    if(currentFloors.length == 0){
        alert('Chưa có tầng nào trong hệ thống')
    } else {
        var formAddBed = '<div class="col-sm-8 col-sm-push-2  border-all">'+
            '<form action="/admin/setup/addBed" method="post" onsubmit="return validateAddBed()">'+
            '<h5 style="text-align: center">Thêm giường</h5>'+
            '<div class="form-group">' +
            '<label>Chọn tầng</label>'+
            '<select class="form-control" name="floors" onchange="optionOfSelectRoom(this)">';
        var floorSorted = currentFloors.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var temp = floorSorted.map(function (x) {
            formAddBed += '<option value="'+x._id+'" >TẦNG '+x.name + '</option>';
        });
        formAddBed +=    '</select>'+
            '</div>'+
            '<div class="form-group">' +
            '<label>Chọn phòng</label>'+
            '<div id="selectRoom">'+
            '<select class="form-control" name="rooms"  >';
        var roomSorted = currentFloors[0].roomList.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var temp2 = roomSorted.map(function (y) {
            formAddBed+= '<option value="'+y._id+'">PHÒNG '+y.name + '</option>';
        })
        formAddBed += '</select>'+
            '</div>'+
            '</div'+
            '<div class="form-group">'+
            '<label>Tên giường </label>'+
            '<input type="text" name="bedName">'+
            '</div>'+
            '<div class="form-group align-center">'+
            '<input class="btn btn-primary form-control" type="submit" value="Thêm">'+
            '</div>'+
            '<input class="hidden" name="id" value='+currentConfig._id+ '>'+
            '</form>'+
            '</div>';
    }
    $('#formAction').append(formAddBed);
    $("select").selectpicker();
});
function validateAddBed() {
    var name = $("input[name='bedName']").val();
    if(name.length <= 0){
        alert('Tên giường không được trống.');
        return false;
    }else{
        alert('Thêm giường thành công.')
        return true;
    }
}
//xoá giường
$('button[name="removeBed"]').click(function () {
    $('#formAction').empty();
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    if(currentFloors.length == 0){
        alert('Chưa có tầng nào trong hệ thống')
    } else {
        var formRemoveBed = '<div class="col-sm-8 col-sm-push-2  border-all">'+
            '<form action="/admin/setup/removeBed" method="post" onsubmit="return validateRemoveBed()">'+
            '<h5 style="text-align: center">Xoá giường</h5>'+
            '<div class="form-group">' +
            '<label>Chọn tầng</label>'+
            '<select class="form-control" name="floors" onchange="optionOfSelectRoom2(this)">';
        var floorSorted = currentFloors.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var temp = floorSorted.map(function (x) {
            formRemoveBed += '<option value="'+x._id+'" >TẦNG '+x.name +'</option>';
        });
        formRemoveBed +=    '</select></div>' +
            '<div class="form-group">' +
            '<label>Chọn phòng</label>'+
            '<div id="selectRoom">'+
            '<select class="form-control" name="rooms" onchange="optionOfSelectBed(this)" >';
        if(currentFloors[0].roomList.length > 0) {
            var roomSorted = currentFloors[0].roomList.sort(function (a, b) {
                var textA = Number(a.name);
                var textB = number(b.name);
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            var temp2 = roomSorted.map(function (y) {
                formRemoveBed += '<option value="' + y._id + '">PHÒNG ' + y.name + '</option>';
            });
            formRemoveBed+= '</select></div></div'+
                '<div class="form-group">'+
                '<label>Chọn giường</label>'+
                '<div id="selectBed"'+
                '<select class="form-control" name="beds" ">';
            if(currentFloors[0].roomList[0].bed.length == 0){
                formRemoveBed += '<option value=""></option>' +
                    '</select>' +
                    '</div>' +
                    '</div>';
            }else{
                var bedSorted = currentFloors[0].roomList[0].bed.sort(function (a, b) {
                    var textA = Number(a.name);
                    var textB = Number(b.name);
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                var temp3 = bedSorted.map(function (z) {
                    formRemoveBed += '<option value="'+z._id+'">GIƯỜNG '+z.name+'</option>';
                })
                formRemoveBed += '</select></div></div>';
            }
        } else{
            formRemoveBed+= '<option value=""></option>';
            formRemoveBed+= '</select>' +
                '</div>' +
                '</div'+
                '<div class="form-group">'+
                '<label>Chọn giường</label>'+
                '<div id="selectBed"'+
                '<select class="form-control" name="beds" ">'+
                '<option value=""></option>'+
                '</select>' +
                '</div>' +
                '</div>';
        }
        formRemoveBed+=
            '<div class="form-group align-center">'+
            '<input class="btn btn-primary form-control" type="submit" value="Xoá">'+
            '</div>'+
            '<input class="hidden" name="configId" value='+currentConfig._id+ '>'+
            '</form>'+
            '</div>';
    }
    $('#formAction').append(formRemoveBed);
    $("select").selectpicker();
});
function validateRemoveBed() {
    alert('Xoá thành công.')
    return true;
}
//đổi option select phòng khi xoá giường
function optionOfSelectRoom2(floor) {
    var floor = floor.value;
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    function indexFloor(element) {
        return element._id == floor;
    }
    var index = currentFloors.findIndex(indexFloor);
    var selectRoomForm = '<select class="form-control" name="rooms" onchange="optionOfSelectBed(this)">';
    var selectBedForm = '<select class="form-control" name="beds">';
    if(currentFloors[index].roomList.length == 0){
        selectRoomForm+= '<option value=""></option>';
        selectBedForm += '<option value=""></option>';
    }else {
        var roomSorted = currentFloors[index].roomList.sort(function (a, b) {
            var textA = Number(a.name);
            var textB = Number(b.name);
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        var temp2 = roomSorted.map(function (y) {
            selectRoomForm+= '<option value="'+y._id+'">PHÒNG '+y.name+'</option>';
        });
        if(currentFloors[index].roomList[0].bed.length == 0){
            selectBedForm += '<option value=""></option>';
        }else{
            var bedSorted = currentFloors[index].roomList[0].bed.sort(function (a, b) {
                var textA = Number(a.name);
                var textB = Number(b.name);
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            var temp3 = bedSorted.map(function (z) {
                selectBedForm+= '<option value="'+z._id+'">GIƯỜNG '+z.name+'</option>';
            })
        }
    }
    selectRoomForm += '</select>';
    selectBedForm +=  '</select>';
    $("#selectRoom").empty();
    $("#selectRoom").append(selectRoomForm);
    $("#selectBed").empty();
    $("#selectBed").append(selectBedForm);
}


function optionOfSelectBed(room) {
    var floor = $('select[name="floors"]').val();
    var room = room.value;
    var currentConfig = JSON.parse($('input[name="currentConfig"]').val());
    var currentFloors = currentConfig.floor;
    function getIndexFloor(element) {
        return element._id == floor;
    }
    function getIndexRoom(element) {
        return element._id == room;
    }
    var floorIndex = currentFloors.findIndex(getIndexFloor);
    var selectBedForm = '<select class="form-control" name="beds">';
    if(currentFloors[floorIndex].roomList.length == 0){
        selectBedForm += '<option value=""></option>';
    }else {
        var roomIndex = currentFloors[floorIndex].roomList.findIndex(getIndexRoom);
        if(currentFloors[floorIndex].roomList[roomIndex].bed.length == 0){
            selectBedForm += '<option value=""></option>';
        }else {
            var bedSorted =  currentFloors[floorIndex].roomList[roomIndex].bed.sort(function (a, b) {
                var textA = Number(a.name);
                var textB = Number(b.name);
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            var temp2 = bedSorted.map(function (y) {
                selectBedForm += '<option value="' + y._id + '">GIƯỜNG ' + y.name  + '</option>';
            })
        }
    }
    selectBedForm += '</select>';
    $("#selectBed").empty();
    $("#selectBed").append(selectBedForm);
}

// QUẢN LÝ LOẠT PHÒNG
// QUẢN LÝ LOAI PHÒNG
function changePublishedRoomType(_id) {
    $.confirm({
        title: 'Thay đổi sử dụng loại phòng!',
        content: 'Bạn có chắc chắn muốn thay đổi không ???',
        buttons: {
            confirm:  {
                text: 'Có',
                btnClass: 'btn-blue',
                action: function(){
                    $.get('/admin/roomType/changePublished/'+ _id , function (message) {
                        if(message.status == 1)
                        {
                            $.alert('Thay đổi thành công');
                            var $row = $('tr[data-id="' + _id + '"]');
                            var a = $row.children().eq(4).children().eq(0);
                            if(a.hasClass('glyphicon-star')){
                                a.removeClass("glyphicon-star")
                                a.addClass("glyphicon-star-empty")
                            }else{
                                a.removeClass("glyphicon-star-empty")
                                a.addClass("glyphicon-star")
                            }
                        }
                    })
                }
            },
            formCancel:{
                text: 'Không',
            },

        }
    });
}
function changeNameRoomType(_id, nameRoomType) {
    $.confirm({
        title: 'ĐỔI TÊN LOẠI PHÒNG ',
        content: '' +
        '<form action=""  class="formName">' +
        '<div class="form-group">' +
        '<label>Loại phòng "' + nameRoomType + '". Bạn có chắc chắn muốn đổi tên loại phòng này không ?</label>' +
        '<input type="text" placeholder="Tên loại phòng" class="name form-control" required />' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Có',
                btnClass: 'btn-blue',
                action: function () {
                    var name = this.$content.find('.name').val();
                    if (!name) {
                        return true;
                    }
                    $.post('/admin/roomType/changeName/'+ _id + '/' + name , function (message) {
                        if(message.status == 1)
                        {
                            $.alert('Đổi tên thành công');
                            var $row = $('tr[data-id="' + _id + '"]');
                            var a = $row.children().eq(1);
                            a.html(name);
                        }
                        else{
                            $.alert('Tên bạn đổi đã tồn tại , vui lòng chọn tên khác');
                        }
                    })
                }
            },
            formCancel:{
                text: 'Không',
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
}
function showRoom(_id , name) {
    var content = "";
    var data = JSON.parse($('#dataFloor').val());

    data.map(function (x) {
        content = '<div>' + content + '<strong>' + x.name + ': </strong>'
        x.roomList.filter(function (y) {
            if(y.type == _id){
                content = content + '<span>' + y.name + ',' +' </span>'
            }
        })
        content = content + '</div>';
        return content  ;
    })
    $.alert({
        btnClass: 'btn-blue',
        title: 'DANH SÁCH' + " " + name.toUpperCase(),
        content: content,
    });
}
function changeNameRoomType(_id, nameRoomType) {
    $.confirm({
        title: 'ĐỔI TÊN LOẠI PHÒNG ',
        content: '' +
        '<form action=""  class="formName">' +
        '<div class="form-group">' +
        '<label>Loại phòng "' + nameRoomType + '". Bạn có chắc chắn muốn đổi tên loại phòng này không ?</label>' +
        '<input type="text" placeholder="Tên loại phòng" class="name form-control" required />' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Có',
                btnClass: 'btn-blue',
                action: function () {
                    var name = this.$content.find('.name').val();
                    if (!name) {
                        return true;
                    }
                    $.post('/admin/roomType/changeName/'+ _id + '/' + name + '/' + nameRoomType , function (message) {
                        if(message.status == 1)
                        {
                            $.alert('Đổi tên thành công');
                            var $row = $('tr[data-id="' + _id + '"]');
                            var a = $row.children().eq(1);
                            a.html(name);
                        }
                        else{
                            $.alert('Tên bạn đổi đã tồn tại , vui lòng chọn tên khác');
                        }
                    })
                }
            },
            formCancel:{
                text: 'Không',
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
}


