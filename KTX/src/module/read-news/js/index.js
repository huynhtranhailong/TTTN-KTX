$(document).ready(function () {

})
function getPage(created,categories,pageNumber,pageSize){
    $.post('/getNewsPag', {created : created, categories : categories, pageNumber : pageNumber, pageSize : pageSize}, function (data) {
        if(data.status == 1){
            $("#sameType").empty();
            $.each(data.news,function (index, element) {
                var date = new Date(element.created);
                var div = '<div class="regular-news">' +
                                '<i class="fa fa-caret-right"></i>' +
                                '<a class="title" href="/tintuc/' + date.getTime()+ '">' + element.title.tonal +
                    '<span class="createdDate">' +' (' + date.getDate() +'/' + (date.getMonth()+1) + '/' + date.getFullYear() + ')'  + '</span></a></div>'
                $("#sameType").append(div);
            })
        }


    })
}