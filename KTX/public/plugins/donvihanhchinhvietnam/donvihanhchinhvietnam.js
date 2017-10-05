(function($) {

    $.fn.dvhcvn = function( options ) {
        var settings = $.extend({
            district:   null,
            province:   null,
            commune:    null,
            onlyProvince: null 
        }, options);

        return this.each( function() {
            if (settings.onlyProvince)
            {
                var provinceSelect = $(this).closest('.dvhcvn').find('.province');

                provinceSelect.empty();

                $.each(provincesList, (index, val) => provinceSelect.append("<option value=" + val.id + (val.id == settings.onlyProvince ? " selected=true" : "") + ">" + val.name + "</option>"));
            }

            if (settings.commune) 
            {
                const districtId = communesList.filter(x => x.id == settings.commune)[0].districtId;
                      provinceId = districtsList.filter(x => x.id == districtId)[0].provinceId;

                var communesInDistrict = communesList.filter(x => x.districtId == districtId);
               
                var districtsInProvince = districtsList.filter(x => x.provinceId == provinceId);

                var communeSelect = $(this).closest('.dvhcvn').find('.commune'); communeSelect.empty();

                var districtSelect = $(this).closest('.dvhcvn').find('.district'); districtSelect.empty();

                var provinceSelect = $(this).closest('.dvhcvn').find('.province'); provinceSelect.empty();

                $.each(communesInDistrict, (index, val) => communeSelect.append("<option value=" + val.id + (val.id == settings.commune ? " selected=true" : "") + ">" + val.name + "</option>"));

                $.each(districtsInProvince, (index, val) => districtSelect.append("<option value=" + val.id + (val.id == districtId ? " selected=true" : "") + ">" + val.name + "</option>"));

                $.each(provincesList, (index, val) => provinceSelect.append("<option value=" + val.id + (val.id == provinceId ? " selected=true" : "") + ">" + val.name + "</option>"));
            }

            if (settings.district)
            {
                var communesInDistrict = communesList.filter(x => x.districtId == settings.district);

                var communeSelect = $(this).closest('.dvhcvn').find('.commune');

                communeSelect.empty();

                $.each(communesInDistrict, (index, val) => communeSelect.append("<option value=" + val.id + ">" + val.name + "</option>"));                   
            }

            if (settings.province)
            {
                var districtsInProvince = districtsList.filter(x => x.provinceId == settings.province);

                var defaultDistrict = districtsInProvince[0].id;

                var communesInDefaultDistrict = communesList.filter(x => x.districtId == defaultDistrict);

                var districtSelect = $(this).closest('.dvhcvn').find('.district');

                var communeSelect = $(this).closest('.dvhcvn').find('.commune');

                districtSelect.empty();

                communeSelect.empty();

                $.each(districtsInProvince, (index, val) => districtSelect.append("<option value=" + val.id + ">" + val.name + "</option>"));                   

                $.each(communesInDefaultDistrict, (index, val) => communeSelect.append("<option value=" + val.id + ">" + val.name + "</option>"));
            }
        });

    }

}(jQuery));