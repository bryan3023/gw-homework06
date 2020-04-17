"use strict";

let WeatherView = {

  /*
    The search bar on the left side
   */
  searchForm: {

    /*
      Callback to run the search query with the provided text.
     */
    searchCallback: null,

    /*
      Wire in the event handler for the search form.
     */
    show() {
      $("#weather-search").on("submit", (response) => {
        event.preventDefault();

        let searchQuery = $("#searchInput").val();
        this.searchCallback(searchQuery);
      });
    },

    setCallbacks(searchCallback) {
      this.searchCallback = searchCallback;
    }
  },


  /*
    The list of recent searchs on the left side.
   */
  recentPlaces: {

    /*
      Callback to run the search of the clicked link.
     */
    searchCallback: null,


    /*
      Render the list of recent places.
     */
    show(recentPlaces) {
      let recent = $("#weather-recent");

      recent.empty();

      for (let place of recentPlaces) {
        let placeA = $("<a>")
          .addClass("list-group-item list-group-item-action")
          .attr("href", "#")
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


  /*
    The current weather card on the top-half of the main dashboard.
   */
  currentWeather: {

    /*
      Render the current weather card.
     */
    show(currentWeather) {
      let
        currentWeatherHeader = $("#current-weather div h2"),
        currentWeatherIcon =
          $("<img>")
            .attr("src", currentWeather.weatherIcon)
            .attr("alt", currentWeather.weatherDescription)
            .attr("crossorigin","anonymous");

      currentWeatherHeader
        .text(`${currentWeather.locationName} (${currentWeather.date})`)
        .append(currentWeatherIcon);

      $("#weather-info").show();

      let currentWeatherBody = $("#current-weather div div");
      currentWeatherBody.empty()
      currentWeatherBody.append(this.getCardText(`Temperature: ${currentWeather.temperature}°F`));
      currentWeatherBody.append(this.getCardText(`Humidity: ${currentWeather.humidity}%`));
      currentWeatherBody.append(this.getCardText(`Wind Speed: ${currentWeather.windSpeed} MPH`));
      currentWeatherBody.append(this.getUvStatus(currentWeather));
    },


    /*
      Return a paragraph within the card.
     */
    getCardText(text) {
      return $("<p>")
        .addClass("card-text")
        .text(text);
    },


    /*
      Return a paragraph with a color-coded UV index.
     */
    getUvStatus(currentWeather) {
      let
        uvP = $("<p>"),
        uvSpan = $("<span>")
          .addClass(`badge badge-${this.uvIndexColor[currentWeather.uvIndexSeverity]}`)
          .text(currentWeather.uvIndex);

      uvP
        .addClass("card-text")
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


  /*
    The five-day forecast on the lower half of the main dashboard.
   */
  fiveDayForecast: {
  
    /*
      Render the five-day forecast on the dashboard.
     */
    show(fiveDayForecast) {
      let forecastCards = $("#five-day-forecast");
      forecastCards.empty();

      for (let day of fiveDayForecast) {
        forecastCards.append(this.getForecastCard(day));
      }
    },


    /*
      Return a new card for a given day of a foreacaste. We're creating an
      HTML snippet in the following format:

        <div class="col-sm-6 col-md-3 col-xl-2 mb-3 mb-sm-4">
          <div class="card bg-primary text-light">
            <div class="card-body">
              <h5 class="card-title">4/15/2020</h5>
              <p class="card-text">[icon]</p>
              <p class="card-text">Temp: 86.84 F</p>
              <p class="card-text">Humidity: 43%</p>
            </div>
          </div>
        </div>
    */
    getForecastCard(forecastDay) {
      let
        cardHeader = $("<h5>")
          .addClass("card-title")
          .text(forecastDay.date),

        cardIconImg = $("<img>")
          .attr("src", forecastDay.weatherIcon)
          .attr("alt", forecastDay.weatherDescription)
          .attr("crossorigin","anonymous"),
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
    },
  },


  hideDashboard() {
    $("#weather-info").hide();
  }
}