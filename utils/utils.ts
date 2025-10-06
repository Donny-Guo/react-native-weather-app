import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type Unit = "metric" | "imperial";
export const TEMPERATURE_UNIT: Record<Unit, string> = {
  "metric": '\u2103',
  "imperial": '\u2109'
}
export const SPEED_UNIT: Record<Unit, string> = {
  "metric": "KPH",
  "imperial": "MPH"
}
export interface FavoriteItem {
  name: string,
  region: string,
  zipCode: string,
};

export interface ForecastData {
  location: { name: string, region: string },
  current: {
    "temp_c": number, "temp_f": number,
    "feelslike_c": number, "feelslike_f": number,
    "wind_mph": number, "wind_kph": number,
    "wind_dir": string
  },
  forecast: {
    forecastday: {
      date: string,
      astro: {
        sunrise: string,
        sunset: string,
      },
      day: {
        "maxtemp_c": number, "maxtemp_f": number,
        "mintemp_c": number, "mintemp_f": number,
        condition: {
          icon: string,
        }
      },
      hour: {
        time_epoch: number,
        condition: {
          icon: string,
        },
        temp_c: number,
        temp_f: number,
        humidity: number,
      }[]
    }[]
  }
};

export interface CurrentWeather {
  "temp": number,
  "feelslike": number,
  "wind": number,
  "wind_dir": string,
  "sunrise": string,
  "sunset": string
}

export interface CurrentLocation {
  "name": string,
  "region": string,
  "zipCode": string
}

export interface ForecastWeather {
  "date": string,
  "maxTemp": number,
  "minTemp": number,
  "iconLink": string
};

export interface HourlyData {
  time_epoch: number,
  iconLink: string,
  temp_c: number,
  temp_f: number,
  humidity: number,
}

export interface HourlyForecast {
  date: string,
  hour: HourlyData[],
}

export interface WeatherData {
  forecastWeather: Record<Unit, ForecastWeather[]> | null,
  currentWeather: Record<Unit, CurrentWeather> | null,
  currentLocation: CurrentLocation | null,
  hourlyForecast: HourlyForecast[] | null,
}

export interface UserData {
  userInput: string,
  unit: Unit,
}

export interface UserContextType {
  userInput: string,
  setUserInput: (newInput: string) => void,
  unit: Unit,
  setUnit: (newUnit: Unit) => void,
  favorites: FavoriteItem[],
  setFavorites: (newFavorites: FavoriteItem[]) => void,
};

// fetch forecast data from weather api
export const fetchForecastData = async (zipCode: string): Promise<ForecastData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${zipCode}&days=3&aqi=no&alerts=no`);
    const json = await response.json();
    if (!response.ok) {
      console.log(`Fail to get forecast data: ${json.error?.message}`)
      return null;
    }
    return json;
  } catch (error) {
    console.log(getErrorMessage(error));
    return null;
  }
}

// fetch location data from weather api
export const fetchLocationData = async (zipCode: string): Promise<CurrentLocation | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/current.json?key=${API_KEY}&q=${zipCode}&days=3&aqi=no&alerts=no`);
    const json = await response.json();
    console.log("json: ", json);

    if (!response.ok) {
      console.log(`Fail to get forecast data: ${json.error?.message}`)
      return null;
    }
    const { name, region } = json['location']
    console.log("name:", name);
    return {
      name, region, zipCode
    };
  } catch (error) {
    console.log(getErrorMessage(error));
    return null;
  }
}


// fetch all favorite locations from AsyncStorage
export async function fetchFavorites(): Promise<FavoriteItem[]> {
  try {
    const data = await AsyncStorage.getItem("favorites");
    return data === null ? [] : JSON.parse(data);
  } catch (error) {
    console.log("Fail to get favorites from AsyncStorage");
    return [];
  }
}

// add a new location to favorites in AsyncStorage
export async function postFavorite(zipCode: string, name: string, region: string) {
  const favoriteItem = {
    zipCode,
    name,
    region,
  }
  try {
    const prev = await fetchFavorites();
    const index = prev.findIndex(item => item.zipCode === zipCode);
    if (index === -1) {
      await AsyncStorage.setItem("favorites", JSON.stringify([...prev, favoriteItem]));
    }
  } catch (error) {
    console.log("Fail to set favorites to AsyncStorage");
  }
}

// remove item from favorites in AsyncStorage
export async function deleteFavorite(zipCode: string) {
  try {
    const prev = await fetchFavorites();
    await AsyncStorage.setItem("favorites", JSON.stringify(prev.filter(item => (
      item['zipCode'] !== zipCode
    ))));
  } catch (error) {
    console.log("Fail to remove favorite item from AsyncStorage");
  }
}

// A local helper function to handle error messages in try-catch
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}