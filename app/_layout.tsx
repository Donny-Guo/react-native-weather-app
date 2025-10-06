import Drawer from "expo-router/drawer";
import WeatherContext from "@/utils/WeatherContext";
import UserContext from "@/utils/UserContext";
import {useState, useEffect} from 'react';
import { WeatherData, FavoriteItem, fetchFavorites, Unit, fetchForecastData, ForecastWeather, HourlyForecast } from "@/utils/utils";

const RootLayout = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("imperial");
  const [weatherData, setWeatherData] = useState<WeatherData>(
    {
      forecastWeather: null,
      currentLocation: null,
      currentWeather: null,
      hourlyForecast: null,
    }
  );
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const getFavorites = async () => {
      const data = await fetchFavorites();
      setFavorites(data);
    }
    getFavorites();
  }, [])

  const getForecastWeatherData = async (zipCode: string) => {
    
    const forecastData = await fetchForecastData(zipCode);
    if (forecastData === null) {
      console.log("fail to fetch forecast data");
      return;
    }
    const {
      location: { name, region },
      current: {
        temp_c, temp_f,
        feelslike_c, feelslike_f,
        wind_mph, wind_kph, wind_dir
      },
      forecast: {
        forecastday: [{
          astro: {
            sunrise, sunset,
          }, ...restOfFirstDay
        }, ...restOfForecast]
      }
    } = forecastData;

    const currentWeather = {
      "imperial": {
        temp: temp_f,
        feelslike: feelslike_f,
        wind: wind_mph,
        wind_dir,
        sunrise,
        sunset
      },
      "metric": {
        temp: temp_c,
        feelslike: feelslike_c,
        wind: wind_kph,
        wind_dir,
        sunrise,
        sunset
      }
    }

    const forecast_day = forecastData['forecast']['forecastday']
    let forecastWeather: Record<Unit, ForecastWeather[]> | null = null;
    let hourlyForecast: HourlyForecast[] | null = null;

    if (Array.isArray(forecast_day)) {
      const forecast_day_metric = forecast_day.map(item => (
        {
          "date": item['date'],
          "maxTemp": item['day']['maxtemp_c'],
          "minTemp": item['day']['mintemp_c'],
          "iconLink": "https:" + item['day']['condition']['icon']
        }
      ));
      const forecast_day_imperial = forecast_day.map(item => (
        {
          "date": item['date'],
          "maxTemp": item['day']['maxtemp_f'],
          "minTemp": item['day']['mintemp_f'],
          "iconLink": "https:" + item['day']['condition']['icon']
        }
      ));
      forecastWeather = {
        "metric": forecast_day_metric,
        "imperial": forecast_day_imperial
      }

      hourlyForecast = forecast_day.map(item => (
        {
          date: item['date'],
          hour: item['hour'].map((hour) => ({
            "time_epoch": hour['time_epoch'],
            "iconLink": "https:" + hour['condition']['icon'],
            "temp_c": hour['temp_c'],
            "temp_f": hour['temp_f'],
            "humidity": hour['humidity']
          }))
        }
      ))
    }
    const data = {
      forecastWeather,
      currentWeather,
      currentLocation: { name, region, zipCode },
      hourlyForecast
    }
    console.log("set weather data:", data);
    setWeatherData(data);
  }

  console.log("user input:", userInput);
  console.log("weatherData:", weatherData);
  console.log("favorites:", favorites);

  return (
    <WeatherContext value={{ weatherData, setWeatherData, getForecastWeatherData }}>
      <UserContext value={{ userInput, setUserInput, unit, setUnit, favorites, setFavorites }}>
        <Drawer screenOptions={{
          drawerHideStatusBarOnOpen: true,
        }}>
          <Drawer.Screen name="(stacks)" options={{ drawerLabel: "Weather", title: "Weather" }} />
          <Drawer.Screen name="manage-favorites-page" options={{ drawerLabel: "Manage Favorites", headerTitle: "Manage Favorites" }} />
        </Drawer>
      </UserContext>
    </WeatherContext>
    
  );
};

export default RootLayout;