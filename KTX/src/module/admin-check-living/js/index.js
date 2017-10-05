$(document).ready(function () {

    var data = JSON.parse($("#data").val());
    var table = $("#infoTable").DataTable( {
        responsive: true,
        bLengthChange: false,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        }
    });

    $("select[name='registerTime']").change(function () {
        var data = {registerList : $("select[name='registerTime']").val()}
        $.post('/admin/getReglist',data,function (result) {
            $("input[name='registerId']").val(result._id);
            $("#infoTable > tbody").empty();
            $.each(result.listUser, function (index, item){
                var row =
                    "<tr data-id=" + item._id + ">" +
                        "<td>" + (index + 1) + "</td>" +
                        "<td class='popInfo'>" + item.user.id + "</td>" +
                        "<td style='text-align: left'>" + item.user.name.familyName + "</td>" +
                        "<td>" + item.user.name.givenName + "</td>" +
                        "<td>" + ((item.user.details.gender) ? "Nam" : "Nữ") + "</td>" +
                        "<td>" + (moment(item.user.details.birthday).format("DD/MM/YYYY")) + "</td>" +
                        "<td>" + item.user.details.birthplace + "</td>" +
                        "<td>" + (moment(item.date).format('DD/MM/YYYY, HH:mm')) + "</td>";
                        if(item.status == "1"){
                            row += "<td> <i class='glyphicon glyphicon-remove toggleStay'></i> <i class='glyphicon glyphicon-map-marker'></i></td>";
                        }else
                        {
                            row += "<td> <i class='glyphicon glyphicon-ok toggleStay'></i> <i class='glyphicon glyphicon-map-marker'></i></td>";
                        }

                        row+= "</tr>";
                $("#infoTable > tbody").append(row);
                $('.toggleStay').unbind();
                $('.toggleStay').click(function () {
                    var _this = $(this);
                    var row = _this.parent().parent();
                    var rowId = row.data("id");
                    var registerId = $("input[name='registerId']").val()
                    var data = {
                        rowId: rowId,
                        registerId: registerId
                    }
                    var name = _this.parents("tr").eq(0).children().eq(2).text() +" "+ _this.parents("tr").eq(0).children().eq(3).text();
                    var msg ="Bạn đang duyệt cho sinh viên " + name + " lưu trú (không xếp phòng)";
                    var msg2 = "DUYỆT";
                    if (_this.hasClass("glyphicon-remove")) {
                        msg = "Bạn đang bỏ duyệt cho sinh viên " + name;
                        msg2 = "BỎ DUYỆT";
                    }
                    $.confirm({
                        title: 'DUYỆT LƯU TRÚ',
                        content: msg,
                        buttons:{
                            OK: {
                                btnClass: 'btn-blue',
                                text: msg2,
                                action: function () {
                                    $.post('/admin/updateReglist', data , function (message) {
                                        if(message.status == 1){
                                        }
                                        else $.alert('Đã có lỗi xảy ra');
                                        if (_this.hasClass("glyphicon-remove")) {
                                            _this.removeClass("glyphicon-remove");
                                            _this.addClass("glyphicon-ok");
                                        }
                                        else {
                                            _this.removeClass("glyphicon-ok");
                                            _this.addClass("glyphicon-remove");
                                        }
                                    })
                                }
                            },
                            cancel: {
                                text: 'Hủy bỏ',
                                action: function () {
                                },
                            }
                        }
                    })
                })
                $('.popInfo').unbind();
                $('.popInfo').click(function () {

                    var _this = $(this);
                    var row = _this.parent();
                    var rowId = row.data("id");
                    var registerId = $("input[name='registerId']").val()
                    var data = {
                        rowId: rowId,
                        registerId: registerId
                    }
                    $.post('/admin/viewInfo', data, function (user) {
                        var userInfo = user;
                        $.confirm({
                            title: 'THÔNG TIN SINH VIÊN ',
                            content: '' +
                            '<p>' + '<label>Họ tên sinh viên: </label> ' + userInfo.name.familyName +" "+ userInfo.name.givenName + '</p>' +
                            '<p>' + '<label>MSSV: </label> ' + userInfo.id +
                            '<p>' + '<label>Email: </label> ' + userInfo.email +
                            '<p>' + '<label>Địa chỉ thường trú: </label> ' + userInfo.details.temporaryAddress.details +
                            '<p>' + '<label>CMND: </label> ' + userInfo.details.identityCard.id +
                            '<p>' + '<label>Dân tộc: </label> ' + userInfo.details.ethnicity +
                            '<p>' + '<label>Tôn giáo: </label> ' + userInfo.details.religion +
                            '<p>' + '<label>Số điện thoại: </label> ' + userInfo.details.phone
                            ,
                            buttons: {
                                OK:  {
                                    text: 'Đóng',
                                    action: function () {
                                    }//close
                                },
                            }
                        })
                    })
                })
            });
        });
    });

    $('.toggleStay').click(function () {
        var _this = $(this);
        var row = _this.parent().parent();
        var rowId = row.data("id");
        var registerId = $("input[name='registerId']").val()
        var data = {
            rowId: rowId,
            registerId: registerId
        }
        var name = _this.parents("tr").eq(0).children().eq(2).text() +" "+ _this.parents("tr").eq(0).children().eq(3).text();
        var msg ="Bạn đang duyệt cho sinh viên " + name + " lưu trú (không xếp phòng)";
        var msg2 = "DUYỆT";
        if (_this.hasClass("glyphicon-remove")) {
            msg = "Bạn đang bỏ duyệt cho sinh viên " + name;
            msg2 = "BỎ DUYỆT";
        }
        $.confirm({
            title: 'DUYỆT LƯU TRÚ',
            content: msg,
            buttons:{
                OK: {
                    btnClass: 'btn-blue',
                    text: msg2,
                    action: function () {
                        $.post('/admin/updateReglist', data , function (message) {
                            if(message.status == 1){
                            }
                            else $.alert('Đã có lỗi xảy ra');
                            if (_this.hasClass("glyphicon-remove")) {
                                _this.removeClass("glyphicon-remove");
                                _this.addClass("glyphicon-ok");
                            }
                            else {
                                _this.removeClass("glyphicon-ok");
                                _this.addClass("glyphicon-remove");
                            }
                        })
                    }
                },
                cancel: {
                    text: 'Hủy bỏ',
                    action: function () {
                    },
                }
            }
        })
    })

    $('.popInfo').click(function () {

        var _this = $(this);
        var row = _this.parent();
        var rowId = row.data("id");
        var registerId = $("input[name='registerId']").val()
        var data = {
            rowId: rowId,
            registerId: registerId
        }
        $.post('/admin/viewInfo', data, function (user) {
            var userInfo = user;
            $.confirm({
                title: 'THÔNG TIN SINH VIÊN ',
                content: '' +
                '<p>' + '<label>Họ tên sinh viên: </label> ' + userInfo.name.familyName +" "+ userInfo.name.givenName + '</p>' +
                '<p>' + '<label>MSSV: </label> ' + userInfo.id +
                '<p>' + '<label>Email: </label> ' + userInfo.email +
                '<p>' + '<label>Địa chỉ thường trú: </label> ' + userInfo.details.temporaryAddress.details +
                '<p>' + '<label>CMND: </label> ' + userInfo.details.identityCard.id +
                '<p>' + '<label>Dân tộc: </label> ' + userInfo.details.ethnicity +
                '<p>' + '<label>Tôn giáo: </label> ' + userInfo.details.religion +
                '<p>' + '<label>Số điện thoại: </label> ' + userInfo.details.phone
                ,
                buttons: {
                    OK:  {
                        text: 'Đóng',
                        action: function () {
                        }//close
                    },
                }
            })
        })
    })

    $('#finish').click(function () {
        var _this = $(this);
        var registerId = $("input[name='registerId']").val()
        $.confirm({
            title: 'DUYỆT LƯU TRÚ',
            content: 'Bạn có chắc chắn kết thúc việc duyệt lưu trú?',
            buttons:{
                OK: {
                    btnClass: 'btn-blue',
                    text: 'XÁC NHẬN',
                    action: function () {
                        $.post('/admin/confirmStay', {data: registerId}, function (message) {
                            if (message.status==1){
                                $.alert('Xét duyệt thành công');
                            }
                            else alert('Error');
                        })
                    }
                },
                CANCEL: {
                    text: 'HỦY BỎ',
                    action: function () {
                    }
                }
            }
        })
    })

    $('#export').click(function () {
        var _this = $(this);
        var registerId = $("input[name='registerId']").val()
        $.confirm({
            title: 'DUYỆT LƯU TRÚ',
            content: 'Xuất danh sách duyệt lưu trú đợt này?',
            buttons:{
                OK: {
                    btnClass: 'btn-blue',
                    text: 'XÁC NHẬN',
                    action: function () {
                        $.post('/admin/exportFile', {data: registerId}, function (message) {
                            if (message.status==1) {
                                window.location.replace(message.link);
                            }
                        })
                    }
                },
                CANCEL: {
                    text: 'HỦY BỎ',
                    action: function () {
                    }
                }
            }
        })
    })
})


function parseDate(dateString) {
    var dateArray = dateString.split('/');
    var result = new Date(dateArray[2], dateArray[1] - 1, dateArray[0])
    return isNaN(result.getTime()) ? null : result;
}