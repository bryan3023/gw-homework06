"use strict";

let WeatherController = {

  model: null,
  view: null,

  start() {
    this.model = WeatherModel;
    this.view = WeatherView;

    this.model.start();
  }
}

WeatherController.start();