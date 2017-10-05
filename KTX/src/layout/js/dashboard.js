$(document).ready(function () {
    var link = $("aside").find("a[href='" + window.location.pathname + "']");

    var linkNotInSideBar = [
        {original: 'cv/id=', reference: '/admin/info/view'},
        {original: '/admin/tin-tuc/chinh-sua/id=', reference: '/admin/tin-tuc/quan-ly'},
        {original: '/score/mark', reference: '/admin/activity/score/render'},
        {original: '/score/discipline', reference: '/admin/activity/score/render'},
        {original: '/admin/external/details/id=', reference: '/admin/external/view'},
        {original: '/external/details/id=', reference: '/external/view'},
        {original: '/admin/activity/id=', reference: '/admin/activity/publish'}
    ]

    if (link.length === 0)
    {
        var reference = linkNotInSideBar.find(function (x) {
            return window.location.pathname.indexOf(x.original) >= 0
        }).reference;

        link = $("aside").find("a[href='" + reference + "']");
    }

    link.parent().addClass('active');

    if (link.closest('ul').hasClass('ml-menu'))
        link.closest('ul').parent().addClass('active');
});