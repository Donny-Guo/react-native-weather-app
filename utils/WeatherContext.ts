import { createContext } from "react";
import { Unit, WeatherData } from "./utils";

type WeatherContextType = {
  weatherData: WeatherData;
  setWeatherData: (newData: WeatherData) => void;
};

const WeatherContext = createContext<WeatherContextType>({
  weatherData: {
    forecastWeather: null,
    currentWeather: null,
    currentLocation: null,
    hourlyForecast: null,
  },
  setWeatherData: (newData) => { }
});

export default WeatherContext;