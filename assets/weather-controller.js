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
  },


  updateDashboard() {
    console.log(this.model.getCurrentWeather());
    this.view.currentWeather.show(this.model.getCurrentWeather());
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