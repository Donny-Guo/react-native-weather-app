import InputContext from "@/utils/InputContext";
import { WeatherData } from "@/utils/utils";
import WeatherContext from "@/utils/WeatherContext";
import { Stack } from "expo-router";
import { useState } from "react";

const MainLayout = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData>(
    {
      forecastWeather: null,
      currentLocation: null,
      currentWeather: null
    }
  );

  console.log("user input:", userInput);
  console.log("weatherData:", weatherData);

  return (
    <WeatherContext value={{ weatherData, setWeatherData }}>
      <InputContext value={{ userInput, setUserInput }}>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
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