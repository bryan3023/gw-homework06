"use strict";

let WeatherController = {

  model: null,
  view: null,

  start() {
    this.model = WeatherModel;
    this.view = WeatherView;

    this.model.start()
    this.model.setCallbacks(
      WeatherController.updateDashboard,
      WeatherController.reportFailure
    );

    this.view.searchForm.setCallbacks(query => WeatherController.searchWeather(query));
    this.view.recentPlaces.setCallbacks(query => WeatherController.searchWeather(query));

    this.view.searchForm.show();
    this.view.recentPlaces.show(this.model.getRecentPlaces());
  },

  searchWeather(query) {
    this.model.searchWeather(query);

    // the timeout is a clunky workaround to fix an async issue. If we call this
    // immediately, there won't be any results to show. I need to wire an event
    // from the model to let fire this off only once the requests are done.
    setTimeout(() => this.updateDashboard(), 2000);
  },

  updateDashboard() {
    console.log(this.model.getCurrentWeather());
    this.view.currentWeather.show(this.model.getCurrentWeather());
    this.view.fiveDayForecast.show(this.model.getFiveDayForecast());
    this.view.recentPlaces.show(this.model.getRecentPlaces());
  },


  /*
    Show an error if the AJAX call for some reason.
    TODO: Revisit to make more user-friendly than an alert.
   */
  reportFailure(xhr) {
    alert(xhr.responseJSON.message);
  }
}

WeatherController.start();