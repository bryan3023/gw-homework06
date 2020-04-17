"use strict";

let WeatherView = {

  searchFrom: {},

  recentPlaces: {},

  currentWeather: {
    show(currentWeather) {
      let
        currentWeatherHeader = $("#current-weather div h2"),
        currentWeatherIcon =
          $("<img>")
            .attr("src", currentWeather.weatherIcon)
            .attr("alt", currentWeather.weatherDescription);

      currentWeatherHeader
        .text(`${currentWeather.locationName} (${currentWeather.date})`)
        .append(currentWeatherIcon);

      let currentWeatherBody = $("#current-weather div div");
      currentWeatherBody.empty()
      currentWeatherBody.append(this.getCardText(`Temperature: ${currentWeather.temperature}°F`));
      currentWeatherBody.append(this.getCardText(`Humidity: ${currentWeather.humidity}%`));
      currentWeatherBody.append(this.getCardText(`Wind Speed: ${currentWeather.windSpeed} MPH`));
      currentWeatherBody.append(this.getUvStatus(currentWeather));
    },

    getCardText(text) {
      //<p class="card-text">
      return $("<p>")
        .addClass("card-text")
        .text(text);
    },

    getUvStatus(currentWeather) {
      let
        uvP = $("<p>"),
        uvSpan = $("<span>")
          .addClass(`badge badge-${this.uvIndexColor[currentWeather.uvIndexSeverity]}`)
          .text(currentWeather.uvIndex);

      uvP
        .text("UV Index: ")
        .append(uvSpan);

      return uvP;
    },


    /*
      Lookup table to color-code UV index.
     */
    uvIndexColor: {
      "unknown": "secondary",
      "low": "success",
      "moderate": "warning",
      "very high": "danger"
    }
  },

  fiveDayForecast: {}
}