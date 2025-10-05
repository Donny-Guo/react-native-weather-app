import { Alert } from "react-native";

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
  id: number
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

export interface WeatherData {
  forecastWeather: Record<Unit, ForecastWeather[]> | null,
  currentWeather: Record<Unit, CurrentWeather> | null,
  currentLocation: CurrentLocation | null,
}

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

// fetch forecast data from weather api
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

// send a get request to express server in order to
// fetch all favorite locations
export async function fetchFavorites(url: string): Promise<FavoriteItem[]> {
  try {
    const response = await fetch(`${url}/favorites`);
    const json = await response.json();
    if (!response.ok) {
      Alert.alert(`Fail to get favorites: ${json.error?.message}`)
      return [];
    }
    return json;
  } catch (error) {
    console.log(getErrorMessage(error));
    return [];
  }
}

// send a post request to server in order to 
// add a new location to favorites
export async function postFavorite(zipCode: string, name: string, region: string, url: string): Promise<number> {

  const favoriteItem = {
    zipCode,
    name,
    region,
  }
  try {
    const response = await fetch(`${url}/favorites`, {
      method: "POST",
      body: JSON.stringify(favoriteItem),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const json = await response.json();
    if (!response.ok) {
      Alert.alert(`Fail to add new favorite: ${json.error?.message}`)
      return -1;
    }
    return json.id;
  } catch (error) {
    console.log(getErrorMessage(error));
    return -1;
  }
}

// send a delete request to the server
// in order to delete a favorite item
// return true if deletion is successful
export async function deleteFavorite(id: string, url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/favorites/${id}`, {
      method: "DELETE"
    })
    if (response.ok) {
      return true;
    } else {
      Alert.alert(`Failed to delete favorite with id ${id}.`)
      return false;
    }
  } catch (error) {
    console.log(getErrorMessage(error));
    return false;
  }
}

// A local helper function to handle error messages in try-catch
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}