$(document).ready(function () {
    navigator.geolocation.getCurrentPosition(function (position) {
            $('#map')
                .gmap3({
                    center:[position.coords.latitude, position.coords.longitude],
                    zoom: 17
                })
                .marker([
                    {position:[position.coords.latitude, position.coords.longitude], icon: "/media/icon/cse_48x48.ico"}
                ]);

            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude +"," + position.coords.longitude +"&sensor=true", function (data, success) {
                $("#address").text(data.results[0].formatted_address);
            });

            $.get("/location/get/latlng=" + position.coords.latitude +"," + position.coords.longitude, function (data, success) {

            })

        },
        function (err) {
            $('#map')
                .gmap3({
                    center:[10.7719568, 106.65886630000001],
                    zoom: 15
                })
                .marker([
                    {position:[10.7719568, 106.65886630000001]}
                ])

        })
});
