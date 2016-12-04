$(document).ready(function() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    handleError()
  }

  function showPosition(p) {
    console.log(p.coords.latitude + "," + p.coords.longitude);

    lat = p.coords.latitude;
    long = p.coords.longitude;
    handleError();
  }

  function handleError() {

    $.get("http://ipinfo.io", function(response) {
      var x = response.loc.split(',');
      lat = x[0];
      long = x[1];
      //console.log(response.loc)
      //applyPosition();

      $.get("http://api.wunderground.com/api/9b61919940ae1c79/geolookup/q/" + lat + "," + long + ".json", function(response) {

        var city = response.location.city;
        var state = response.location.state;

        city = city.split(" ").join("_");
        console.log(city);
        var tempF;
        var tempC;

        $.get("http://api.wunderground.com/api/9b61919940ae1c79/conditions/q/" + state + "/" + city + ".json", function(response) {
          var cond = response.current_observation.weather;
          var icon = response.current_observation.icon_url;
          var fullLoc = response.current_observation.display_location.full;
          tempF = response.current_observation.temp_f;
          tempC = response.current_observation.temp_c;
        
          document.getElementById("city").innerHTML = fullLoc;
          document.getElementById("tempF").innerHTML = tempF + " F°";
          document.getElementById("tempC").innerHTML = tempC + " C°";
          document.getElementById("icon").src = icon;


          $.get("http://api.wunderground.com/api/9b61919940ae1c79/forecast/q/" + state + "/" + city + ".json", function(response) {
            var forecasttext = response.forecast.txt_forecast.forecastday[0].fcttext;
            var forecastMet = response.forecast.txt_forecast.forecastday[0].fcttext_metric;
            //var icon = response.forecast.txt_forecast.forecastday[0].icon_url;
            document.getElementById("forecast").innerHTML = forecasttext;
            document.getElementById("forecastMet").innerHTML = forecastMet;
            //console.log(forecasttext);
           

            $("#buttonC").click(function() {
              $("#forecast").hide()
              $("#forecastMet").show()
              $("#tempF").hide()
              $("#tempC").show()
            });

            $("#buttonF").click(function() {
              $("#forecast").show()
              $("#forecastMet").hide()
              $("#tempF").show()
              $("#tempC").hide()
            });

            console.log(tempC);


          }, "json"); //forecast

        }, "json"); //conditions

      }, "json"); //geolookup

    }, "jsonp"); //ipinfo

  } //handlerror

}); //document ready