"use strict";

let WeatherView = {

  searchForm: {
    searchCallback: null,

    show() {
      $("#weather-search").on("submit", (response) => {
        event.preventDefault();

        let searchQuery = $("#searchInput").val();
        console.log(searchQuery)
        this.searchCallback(searchQuery);
      });
    },

    setCallbacks(searchCallback) {
      this.searchCallback = searchCallback;
    }
  },

  //        <a href="#" class="list-group-item list-group-item-action">Washingon, DC</a>
  recentPlaces: {
    searchCallback: null,

    show(recentPlaces) {
      let recent = $("#weather-recent");

      recent.empty();

      for (let place of recentPlaces) {
        let placeA = $("<a>")
          .addClass("list-group-item list-group-item-action")
          .attr("href", "#")
          .attr("data-value",place)
          .text(place)
          .on("click", event => {
            event.preventDefault();
    
            this.searchCallback(event.target.text);
          })

        recent.append(placeA);
      }
    },

    setCallbacks(searchCallback) {
      this.searchCallback = searchCallback;
    }
  },

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
      unknown: "secondary",
      low: "success",
      moderate: "warning",
      veryHigh: "danger"
    }
  },

  fiveDayForecast: {
    show(fiveDayForecast) {
      let forecastCards = $("#five-day-forecast");
      forecastCards.empty();

      for (let day of fiveDayForecast) {
        console.log(fiveDayForecast)
        forecastCards.append(this.getForecastCard(day));
      }
    },


  //   <div class="col-sm-6 col-md-3 col-xl-2 mb-3 mb-sm-4">
  //   <div class="card bg-primary text-light">
  //     <div class="card-body">
  //       <h5 class="card-title">4/15/2020</h5>
  //       <p class="card-text">[icon]</p>
  //       <p class="card-text">Temp: 86.84 F</p>
  //       <p class="card-text">Humidity: 43%</p>
  //     </div>
  //   </div>
  // </div>


    getForecastCard(forecastDay) {
      let
        cardHeader = $("<h5>")
          .addClass("card-title")
          .text(forecastDay.date),

        cardIconImg = $("<img>")
          .attr("src", forecastDay.weatherIcon)
          .attr("alt", forecastDay.weatherDescription),
        cardIconP = $("<p>")
          .addClass("card-text")
          .append(cardIconImg),

        cardTempP = $("<p>")
          .addClass("card-text")
          .text(`Temp: ${forecastDay.temperature}°F`),

        cardHumidtyP = $("<p>")
          .addClass("card-text")
          .text(`Humidity: ${forecastDay.humidity}%`),
    
        cardBodyDiv = $("<div>")
          .addClass("card-body")
          .append(cardHeader)
          .append(cardIconP)
          .append(cardTempP)
          .append(cardHumidtyP),

        cardDiv = $("<div>")
          .addClass("card bg-primary text-light")
          .append(cardBodyDiv),

        cardColDiv = $("<div>")
          .addClass("col-sm-6 col-md-3 col-xl-2 mb-3 mb-sm-4")
          .append(cardDiv);


        return cardColDiv;
    }
  }
}