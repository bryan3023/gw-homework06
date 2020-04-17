"use strict";

let WeatherModel = {

  openWeatherApiKey: "4211a163bd8258f32fbd3c7ed8d5c12e",
  successResponseCallback: null,
  failedResponseCallback: null,

  recentLocations: null,

  currentWeather: {
    locationName: null,
    date: null,
    weatherDescription: null,
    weatherIcon: null,
    temperature: null,
    humidity: null,
    windSpeed: null,
    uvIndex: null,
    uvIndexSeverity: null
  },

  fiveDayForecast: null,

  start() {
    this.loadRecentLocations();
  },


  setCallbacks(successResponseCallback, failedResponseCallback) {
    this.successResponseCallback = successResponseCallback;
    this.failedResponseCallback = failedResponseCallback;
  },

  getCurrentWeather() {
    return this.currentWeather;
  },

  convertKelvinToFahrenheit(tempKelvin) {
    return (parseFloat(tempKelvin) - 273.15) * 1.80 + 32;
  },

  convertMetersPerSecondToMilesPerHour(speedMps) {
    return speedMps * 2.2369363;
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

  queryOwCurrentWeather(query) {
    let
      queryUrl = this.getApiUrl(query, "weather"),
      result;

    $.ajax({
      url: queryUrl,
      type: "GET"
    }).then(
      (successResponse) => {
        console.log(successResponse);
        this.setCurrentWeather(successResponse);
        this.queryOpenWeatherUvIndex(successResponse);
      },
      (failedResponse) => {
        this.alertAjaxError(queryUrl, failedResponse);
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
    }).then(
      (successResponse) => {
        this.currentWeather.uvIndex = parseFloat(successResponse.value);
        this.currentWeather.uvIndexSeverity = this.getUvIndexSeverity(this.currentWeather.uvIndex);
      console.log(this.currentWeather.uvIndexSeverity)
      },
      (failedResponse) => {
        this.alertAjaxError(failedResponse);
      }
    )
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

  setCurrentWeather(response) {
    this.currentWeather.locationName = response.name;
    this.currentWeather.date = moment().format("MM/DD/YYYY");
    this.currentWeather.weatherDescription = response.weather[0].description;
    this.currentWeather.weatherIcon =  `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
    this.currentWeather.temperature = this.convertKelvinToFahrenheit(parseFloat(response.main.temp)).toFixed(1);
    this.currentWeather.humidity = parseFloat(response.main.humidity);
    this.currentWeather.windSpeed = this.convertMetersPerSecondToMilesPerHour(parseFloat(response.wind.speed)).toFixed(1);
  },

  alertAjaxError(queryUrl, xhr) {
    console.log("Error on query: %s\n  status: %s\n  message: %s",
      queryUrl,
      xhr.status,
      xhr.responseJSON.message
    );
    this.failedResponseCallback(xhr);
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