import InputContext from "@/utils/UserContext";
import { WeatherData, Unit, FavoriteItem, fetchFavorites } from "@/utils/utils";
import WeatherContext from "@/utils/WeatherContext";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";

const MainLayout = () => {
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

  console.log("user input:", userInput);
  console.log("weatherData:", weatherData);
  console.log("favorites:", favorites);

  return (
    <WeatherContext value={{ weatherData, setWeatherData }}>
      <InputContext value={{ userInput, setUserInput, unit, setUnit, favorites, setFavorites }}>
        <Stack>
          <Stack.Screen name='index' options={{ 
            headerShown: false,
            headerTitle: "Weather",
          }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              headerTitle: "Search by Zip Code"
            }}
          />
        </Stack>
      </InputContext>
    </WeatherContext>

  )
}

export default MainLayout