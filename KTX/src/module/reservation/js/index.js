$(document).ready(function () {
    $("table").DataTable({
        responsive: true,
        pageLength: 50,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        }
    });
    $("select").select2();
    var data = $('.registerTime').val();
    $.get('/admin/register/getDescription/'+ data , function (message) {
        if(message.status == 1){
            $('.detail').html(message.registerTime[0].description);
        }
    })
    $(".registerTime").on('select2:select', function (evt) {
        var data = $(this).val();
        $.get('/admin/register/getDescription/'+ data , function (message) {
            if(message.status == 1){
            $('.detail').html(message.registerTime[0].description);
            }
        })
    });
    $(".register").click(function (evt) {
        var roomType = $(".roomType").val();
        var registerTime = $(".registerTime").val();
        var userInfo = JSON.parse($('#session').val());
        //check info not null
        if(userInfo.birthday != null && userInfo.birthplace != null && userInfo.gender != null && userInfo.grade != null
        && userInfo.class != null && userInfo.ethnicity != null && userInfo.religion != null && userInfo.email != null
            && userInfo.phone != null && userInfo.identityCard.place != null && userInfo.identityCard.id != null
            && userInfo.temporaryAddress.communeId != null && userInfo.permanentAddress.communeId != null )
        {
            $.post('/admin/register/create/' + roomType + '/' + registerTime , function (message) {
                if(message.status == -1){
                    $.alert('Bạn đã đăng ký/gia hạn đợt này rồi..!');
                }
                else {
                    $.alert('Đăng ký/Gia hạn thành công..!');
                    window.location = "/admin/register"
                }
            })
        }
        else {
            $.alert('Thông tin cá nhân của bạn thiếu , vui lòng quay lại trang thông tin và cập nhật đầy đủ');
        }
    })
});

function removeRegister(_idRegister , _idListUser) {
    $.confirm({
        title: 'Hủy đăng ký/gia hạn!',
        content: 'Bạn có chắc chắn muốn hủy đợt đăng ký/gia hạn này không ???',
        buttons: {
            confirm:  {
                text: 'Có',
                btnClass: 'btn-blue',
                action: function(){
                    $.get('/admin/register/remove/'+ _idRegister + '/'+ _idListUser , function (message) {
                        if(message.status == 1){
                            $.alert('Hủy thành công..!');
                            window.location = "/admin/register"
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

