/* global $:true */
/* jshint unused:false*/

+ function($) {
  "use strict";
  
  $.fn.cityPicker = function(params) {
    return this.each(function() {
      if(!this) return;
      var format = function(data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
          var d = data[i];
          if(d.name === "请选择") continue;
          result.push(d.name);
        }
        if(result.length) return result;
        return [""];
      };

      var sub = function(data) {
        if(!data.sub) return [""];
        return format(data.sub);
      };

      var getCities = function(d) {
        for(var i=0;i< raw.length;i++) {
          if(raw[i].name === d) return sub(raw[i]);
        }
        return [""];
      };

      var getDistricts = function(p, c) {
        for(var i=0;i< raw.length;i++) {
          if(raw[i].name === p) {
            for(var j=0;j< raw[i].sub.length;j++) {
              if(raw[i].sub[j].name === c) {
                return sub(raw[i].sub[j]);
              }
            }
          }
        }
        return [""];
      };

      var raw = $.smConfig.rawCitiesData;
      var provinces = raw.map(function(d) {
        return d.name;
      });
      var initCities = sub(raw[0]);
      var initDistricts = [""];

      var currentProvince = provinces[0];
      var currentCity = initCities[0];
      var currentDistrict = initDistricts[0];

      var defaults = {

        cssClass: "city-picker",
        rotateEffect: false,  //为了性能

        onChange: function (picker, values, displayValues) {
          var newProvince = values[0];
          var newCity;
          if(newProvince !== currentProvince) {
            var newCities = getCities(newProvince);
            newCity = newCities[0];
            var newDistricts = getDistricts(newProvince, newCity);
            picker.cols[1].replaceValues(newCities);
            picker.cols[2].replaceValues(newDistricts);
            currentProvince = newProvince;
            currentCity = newCity;
            picker.updateValue();
            return;
          }
          newCity = picker.cols[1].value;
          if(newCity !== currentCity) {
            picker.cols[2].replaceValues(getDistricts(newProvince, newCity));
            currentCity = newCity;
            picker.updateValue();
          }
        },

        cols: [
          {
            values: provinces,
            cssClass: "col-province"
          },
          {
            values: initCities,
            cssClass: "col-city"
          },
          {
            values: initDistricts,
            cssClass: "col-district"
          }
        ]
      };

      var p = $.extend(defaults, params);
      //计算value
      var val = $(this).val();
      if(val) {
        p.value = val.split(" ");
        if(p.value[0]) {
          currentProvince = p.value[0];
          p.cols[1].values = getCities(p.value[0]);
        }
        if(p.value[1]) {
          currentCity = p.value[1];
          p.cols[2].values = getDistricts(p.value[0], p.value[1]);
        } else {
          currentDistrict = p.value[2];
          p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0]);
        }
      }
      $(this).picker(p);
    });
  };

}($);
