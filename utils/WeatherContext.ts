import { createContext } from "react";
import { Unit, WeatherData, WeatherContextType } from "./utils";

const WeatherContext = createContext<WeatherContextType>({
  weatherData: {
    forecastWeather: null,
    currentWeather: null,
    currentLocation: null,
    hourlyForecast: null,
  },
  setWeatherData: (newData) => {},
  getForecastWeatherData: (zipCode) => {},
});

export default WeatherContext;