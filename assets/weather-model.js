"use strict";

let WeatherModel = {

  openWeatherApiKey: "4211a163bd8258f32fbd3c7ed8d5c12e",
  failedResponseCallback: null,

  recentLocations: null,

  currentWeather: null,
  fiveDayForecast: null,

  start(failedResponseCallback) {
    this.loadRecentLocations();
    this.failedResponseCallback = failedResponseCallback;
  },


  /*
    Add the location strng to the front of recent locations.
   */
  addRecentLocation(location) {
    this.recentLocations.unshift(location);
    this.saveRecentLocations();
  },


  /*
    Load recent locations from storage or, if it does not exist, create an
    empty array.
   */
  loadRecentLocations() {
    let recentLocations = localStorage.getItem("recentLocations")

    if (recentLocations) {
      this.recentLocations = JSON.parse(recentLocations);
    } else {
      this.recentLocations = [];
      this.saveRecentLocations();
    }
  },


  /*
    Save recent locations to local storage for later use.
   */
  saveRecentLocations() {
    let recentLocations = JSON.stringify(this.recentLocations);
    localStorage.setItem("recentLocations", recentLocations);
  },

  queryOpenWeather(query,queryType) {
    let
      queryUrl = this.getApiUrl(query, queryType),
      result;

    $.ajax({
      url: queryUrl,
      type: "GET"
    }).then(
      (successResponse) => {
        result = this.getCurrentWeather(successResponse);
        console.log(result);
      },
      (failedResponse) => {
        this.alertAjaxError(queryUrl, failedResponse);
        this.failedResponseCallback(failedResponse);
      }
    );
  },

  queryOpenWeatherUvIndex(results) {
    let
      lat = results.coord.lat,
      lon = results.coord.lon,
      queryUrl =`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}`,
      result = null;

    $.ajax({
      url: queryUrl,
      type: "GET"
    }).then(function(response) {
      console.log(response)
      console.log(parseFloat(response.value))
      result = parseFloat(response.value);
    },
    function(failedResponse) {
      this.alertAjaxError(failedResponse);
    }
    )

    return result;
  },


  /*
    Categorize the UV index, using guidance here:
      https://www.epa.gov/sunsafety/uv-index-scale-0
   */
  getUvIndexSeverity(uvIndex) {

    if (!parseInt(uvIndex)) {
      return "unknown"
    } else if (uvIndex <= 2) {
      return "low";
    } else if (uvIndex <= 7) {
      return "moderate";
    } else {
      return "very high";
    }
  },

  queryWeather() {},

  getCurrentWeather(response) {
    let currentWeather = {
      locationName: response.name,
      weatherDescription: response.weather[0].description,
      weatherIcon: response.weather[0].icon,
      temperature: response.main.temp,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      uvIndex: this.queryOpenWeatherUvIndex(response)
    }

    currentWeather.uvIndexSeverity = this.getUvIndexSeverity(currentWeather.uvIndex);
    return currentWeather;
  },

  alertAjaxError(queryUrl, xhr) {
    console.log("Error on query: %s\n  status: %s\n  message: %s",
      queryUrl, xhr.status, xhr.responseJSON.message)

  },

  getApiUrl(query,queryType) {
    let
      baseUrl = "https://api.openweathermap.org/data/2.5/",
      queryString = this.getQueryString(query);

    return baseUrl + queryType + queryString;
  },


  /*
    Return the query string of the API call. If the query is just a number,
    we'll assume it's a zip code.

    During testing, I noticed I'm not getting the expected results for some
    queries. For example, "Washingon, DC" fails, but "Washington, DC, US"
    succeeds. 
   */
  getQueryString(query) {
    if (!query || !query.length) {
      return null;
    }

    let queryString = "";

    if (Number.isInteger(parseInt(query))) {
      queryString = `?zip=${query}`
    } else {
      query = query
        .split(",")
        .map(s => s.trim())
        .map(s => s.toLowerCase())
        .map(s => s.replace(/\s/g, "+"))
        .join(",");

      queryString = `?q=${query}`
    }
    return queryString + `&appid=${this.openWeatherApiKey}`
  }
}