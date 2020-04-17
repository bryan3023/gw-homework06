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

  fiveDayForecast: [],

  start() {
    this.loadRecentLocations();
  },


  setCallbacks(successResponseCallback, failedResponseCallback) {
    this.successResponseCallback = successResponseCallback;
    this.failedResponseCallback = failedResponseCallback;
  },

  searchWeather(query) {
    this.addRecentLocation(query);
    this.queryOwCurrentWeather(query);
    this.queryOwFiveDayForecast(query);
  },


  getCurrentWeather() {
    return this.currentWeather;
  },


  getRecentPlaces() {
    return this.recentLocations;
  },
  

  /*
    Add the location strng to the front of recent locations.
   */
  addRecentLocation(location) {
    if (-1 === this.recentLocations.indexOf(location)) {
      this.recentLocations.unshift(location);
      this.saveRecentLocations();
    }
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
    let queryUrl = this.getApiUrl(query, "weather");

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

  queryOwFiveDayForecast(query) {
    let queryUrl = this.getApiUrl(query, "forecast");

    $.ajax({
      url: queryUrl,
      type: "GET"
    }).then(
      (successResponse) => {
        console.log(successResponse);

        let days = successResponse.list.filter(w => w.dt_txt.includes("00:00:00"))

        this.fiveDayForecast = [];

        for (let day of days) {
          this.fiveDayForecast.push({
            date: moment.unix(parseInt(day.dt)).format("MM/DD"),
            weatherDescription: day.weather[0].description,
            weatherIcon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
            temperature: this.convertKelvinToFahrenheit(parseFloat(day.main.temp)).toFixed(1),
            humidity: parseFloat(day.main.humidity)
          });
        }

        console.log(this.fiveDayForecast)
      },
      (failedResponse) => {
        this.alertAjaxError(queryUrl, failedResponse);
      }
    );

  },

  getFiveDayForecast() {
    console.log(this.fiveDayForecast)
    return this.fiveDayForecast;
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
      return "veryHigh";
    }
  },


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
  },


  // -- Unit conversion functions --

  convertKelvinToFahrenheit(tempKelvin) {
    return (parseFloat(tempKelvin) - 273.15) * 1.80 + 32;
  },

  convertMetersPerSecondToMilesPerHour(speedMps) {
    return speedMps * 2.2369363;
  }
}