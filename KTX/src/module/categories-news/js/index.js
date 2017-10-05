$(document).ready(function () {

})
function getPage(created,categories,pageNumber,pageSize){
    $.post('/getNewsPag', {created : created, categories : categories, pageNumber : pageNumber, pageSize : pageSize}, function (data) {
        if(data.status == 1){
            $(".article").empty();
            $.each(data.news,function (index, element) {
                var date =new Date(element.created)
                var div = '<div class="breaking-news">' +
                            '<div class="quick-review">' +
                                '<a href="/tin-tuc/"' + date.getTime() + ""  + '><div class="title"><i class="fa fa-caret-right"></i>' +
                                '<span>' + element.title.tonal + '</span><p>' +
                             moment(date).format('llll') + '</p></div></a></div><div class="short-content"><p>' +
                             element.abstract+ '</p></div></div>'
                $(".article").append(div);
            })
        }


    })
}