# Weather Dashboard

## Synopsis

This app is a simple weather dashboard. Enter a city name or zip code and you'll see both the current conditions and the five-day forecast for that location. Each search will be added to a locally saved list of places so you can pull them back up quikly in the future.

[Try it now.](https://bryan3023.github.io/gw-homework06/)

## Implementation

This follows the same MVC approach I've used for the the last few assignments. A significant change with this project is that, with the introduction of AJAX-based APIs, it's now necessary to create trigger events from the the model, not just the view.

This app leverages [OpenWeather's](https://openweathermap.org) public APIs to pull down weather information. Specifically, it uses the following calls:

* Current weather by city name
* Current weather by zip code (US only)
* UV index by location latitude and longitude
* Five-day forecast by city name
* Five-day forecast by zip code (US only)

There is a known limitation with this app: trying to search by city and state (e.g., Washington, DC) will fail, but searching either by city alone (Washington) or city, state, country code (Washington, DC, US) will both succeed.

According to [the documentation](https://openweathermap.org/current#name), it should be possible, and I've confirmed the query string is in the right format. Some experimentation revealed "Washington, D.C." works as expected. I contemplated adding in the periods, but I also found that "Beijing, CN" works as you would expect, and so I believe I'd be trading one bug for another. E.g., is "AL" Alabama or Albania?

To make this more robust, I'd need to find use a more reliable geospatial API (maybe Google's?) and pass unambiguous (lat,lon) cooordinates to OpenWeather.