"use strict";

let WeatherController = {

  model: null,
  view: null,

  /*
    Program entry point. Initializes the objects, wires in callbacks, and sets
    the initial view.
   */
  start() {
    this.model = WeatherModel;
    this.view = WeatherView;

    this.model.start()
    this.model.setCallbacks(
      () => WeatherController.updateDashboard(),
      (xhr) => WeatherController.reportFailure(xhr)
    );

    this.view.searchForm.setCallbacks(query => WeatherController.searchWeather(query));
    this.view.recentPlaces.setCallbacks(query => WeatherController.searchWeather(query));

    this.view.searchForm.show();
    this.view.recentPlaces.show(this.model.getRecentPlaces());

    let mostRecent = this.model.getMostRecentPlace();
    if (mostRecent) {
      this.searchWeather(mostRecent);
    }
  },


  /*
    Run the specified search and update the dashboard.
   */
  searchWeather(query) {
    this.model.searchWeather(query);
    this.updateDashboard();
  },


  /*
    Update the page elements with the latest information.    
   */
  updateDashboard() {
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