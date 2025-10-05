import { createContext } from "react";
import { Unit, WeatherData } from "./utils";

type WeatherContextType = {
  weatherData: WeatherData;
  setWeatherData: (newData: WeatherData) => void;
};

/*
  forecastWeather: ForecastWeather[] | null,
  currentWeather: CurrentWeather | null,
  currentLocation: CurrentLocation | null,
*/
const WeatherContext = createContext<WeatherContextType>({
  weatherData: {
    forecastWeather: null,
    currentWeather: null,
    currentLocation: null
  },
  setWeatherData: (newData) => { }
});

export default WeatherContext;