$(document).ready(function () {
    $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
    $('.time24').inputmask('hh:mm', { placeholder: '__:__', alias: 'time24', hourFormat: '24' });

    CKEDITOR.replace('ckeditor', {
        toolbar: [
            { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
            { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting' ] },
            { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
            { name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
            { name: 'insert', items: [ 'Table' ] },
            { name: 'tools', items: [ 'Maximize' ] },
            { name: 'editing', items: [ 'Scayt' ] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor']}
        ],
        language: 'vi'
    });

    CKEDITOR.config.allowedContent = true;

    CKEDITOR.config.height = 350;
})

function editDate(configId,id,startDay,endDay,startTime,endTime,semester,value,index) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'THAY ĐỔI NGÀY CHO ĐỢT ĐĂNG KÝ ' ,
        content: '' +
        '<p> Đang điều chỉnh thông tin  đăng ký cho đợt ' + index + ' học kỳ ' +  value + ' năm học '+ semester + '-' + (parseInt(semester)+1).toString() + '</p>' +
        '<form action="/admin/config/updateRegisterTime" method="post" class="updateDate">' +
        '<div class="col-md-6">' +
        '<div class="form-group">' +
        '<b>Ngày bắt đầu</b>' +
        '<div class="form-line">' +
        '<input class="form-control date" type="text" placeholder="DD/MM/YYYY" name="startDay" value="' + startDay +'"/>' +
        '</div></div></div>'+
        '<div class="col-md-6">' +
        '<div class="form-group">' +
        '<b>Giờ bắt đầu</b>' +
        '<div class="form-line">' +
        '<input class="form-control time24" type="text" placeholder="HH:mm" name="startTime" value="' + startTime +'"/>' +
        '</div></div></div>'+
        '<div class="col-md-6">' +
        '<div class="form-group">' +
        '<b>Ngày kết thúc</b>' +
        '<div class="form-line">' +
        '<input class="form-control date" type="text" placeholder="DD/MM/YYYY" name="endDay" value="' + endDay +'"/>' +
        '</div></div></div>'+
        '<div class="col-md-6">' +
        '<div class="form-group">' +
        '<b>Giờ kết thúc</b>' +
        '<div class="form-line">' +
        '<input class="form-control time24" type="text" placeholder="HH:mm" name="endTime" value="' + endTime +'"/>' +
        '</div></div></div>'+

        '<input name="configId" type="text" class="hidden" value="' + configId + '"/>' +
        '<input name="id" type="text" class="hidden" value="' + id + '"/>' +
        '<input name="semester[year]" type="text" class="hidden" value="' + semester + '"/>' +
        '<input name="semester[value]" type="text" class="hidden" value="' + value + '"/>' +
        '<input name="index" type="text" class="hidden" value="' + index + '"/>' +
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
            $('.time24').inputmask('hh:mm', { placeholder: '__:__', alias: 'time24', hourFormat: '24' });
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });

}


function del(configId,id,semester,value,index) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'XÓA ĐỢT ĐĂNG KÝ' ,
        content: '' +
        '<p> Đang xóa đợt đăng ký thứ ' + index + ' học kỳ ' +  value + ' năm học '+ semester + '-' + (parseInt(semester)+1).toString() + '</p>' +
        '<form action="/admin/config/deleteRegisterTime" method="post" class="updateDate">' +
        '<input name="configId" type="text" class="hidden" value="' + configId + '"/>' +
        '<input name="id" type="text" class="hidden" value="' + id + '"/>' +
        '<input name="index" type="text" class="hidden" value="' + index + '"/>' +
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