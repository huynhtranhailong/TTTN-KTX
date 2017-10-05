$(document).ready(function () {
    $("table").DataTable({
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        }
    });

    $('.togglePublish').click(function () {
        var $this = $(this);
        $.get("/admin/news/togglePublish/id=" + $this.data("id"), function (data, success) {
            switch (data.status) {
                case -2:
                    $.notify({message: "Không được phép thay đổi tình trạng phát hành của ảnh này"}, {type: "danger"});
                    break;
                case -1:
                    $.notify({message: "Đã xảy ra lỗi trong quá trình thay đổi tình trạng phát hành!"}, {type: "danger"});
                    break;
                case 0:
                    $.notify({message: "Không tìm thấy tin có tên như trên"}, {type: "warning"});
                    break;
                case 1:
                    $this.toggleClass('btn-danger');
                    $this.toggleClass('btn-primary');
                    if (!data.news.published) {
                        $.notify({message: "Đã ngưng phát hành bản tin thành công"}, {type: "success"});
                        $this.find('i').text("close");
                    }
                    else {
                        $.notify({message: "Đã phát hành bản tin thành công"}, {type: "success"});
                        $this.find('i').text("check");
                    }
                    break;
            }
        });
    });

    $('.toggleHot').click(function () {
        var $this = $(this);
        $.get("/admin/news/toggleHot/id=" + $this.data("id"), function (data, success) {
            switch (data.status) {
                case -2:
                    $.notify({message: "Không được phép thay đổi tình trạng tin nóng của ảnh này"}, {type: "danger"});
                    break;
                case -1:
                    $.notify({message: "Đã xảy ra lỗi trong quá trình thay đổi tình trạng tin nóng!"}, {type: "danger"});
                    break;
                case 0:
                    $.notify({message: "Không tìm thấy tin có tên như trên"}, {type: "warning"});
                    break;
                case 1:
                    $this.toggleClass('btn-danger');
                    $this.toggleClass('btn-primary');
                    if (!data.news.isHot) {
                        $.notify({message: "Đã ngưng tin này là một tin nóng"}, {type: "success"});
                        $this.find('i').text("close");
                    }
                    else {
                        $.notify({message: "Đã chuyển tin này thành tin nóng thành công"}, {type: "success"});
                        $this.find('i').text("check");
                    }
                    break;
            }
        });
    })

});