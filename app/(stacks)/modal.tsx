import FavoriteElement from '@/components/FavoriteElement';
import LocationElement from '@/components/LocationElement';
import UserContext from '@/utils/UserContext';
import WeatherContext from '@/utils/WeatherContext';
import { CurrentLocation, deleteFavorite, fetchForecastData, fetchLocationData, ForecastWeather, HourlyForecast, Unit } from '@/utils/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ModalPage() {
  const router = useRouter();
  const isZipCodeValid = (s: string) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(s);
  const { userInput, setUserInput, favorites, setFavorites } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const { setWeatherData } = useContext(WeatherContext);
  const [tempLocation, setTempLocation] = useState<CurrentLocation | null>(null)
  const favoriteElements = favorites.map(item => (
    <FavoriteElement key={item.zipCode} {...item}
      onDelete={async () => {
        const newFavorites = favorites.filter(favorite => favorite.zipCode !== item.zipCode);
        setFavorites(newFavorites);
        await deleteFavorite(item.zipCode);
      }}
      onPressFavorite={async () => {
        setUserInput("");
        await getForecastWeatherData(item.zipCode);
        router.back();
      }}
    />
  ))

  const getLocationData = async (zipCode: string) => {
    setLoading(true);
    const response = await fetchLocationData(zipCode);
    setTempLocation(response)
    if (response === null) {
      console.log("no results found");
    } else {
      console.log("temp location:", response);
    }
    setLoading(false);
  }

  // if zipcode is valid: get current weather -> check if zipcode exists
  useEffect(() => {
    if (isZipCodeValid(userInput)) {
      getLocationData(userInput);
    }
  }, [userInput]);

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
      currentLocation: {name, region, zipCode},
      hourlyForecast
    }
    console.log("set weather data:", data);
    setWeatherData(data);

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.modalContainer]}>
        <View style={styles.searchBarRowContainer}>
          <View style={[styles.searchBarContainer]}>
            <FontAwesome name="search" size={15.6} color="#AAAAAA" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder='Enter a Zip Code'
              value={userInput}
              onChangeText={(text) => setUserInput(text)}
            />
          </View>

          <Pressable onPress={e => router.back()}>
            <Text style={styles.buttonText}>
              Cancel
            </Text>
          </Pressable>
        </View>

        <Text style={{ fontSize: 20, marginBottom: 18, marginTop: 27 }}>
          Search Results:
        </Text>


        {isZipCodeValid(userInput) && tempLocation ? (
          <Pressable onPress={async () => {
            setUserInput("");
            await getForecastWeatherData(tempLocation.zipCode);
            router.back();
          }}>
            <View style={styles.searchResult}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <LocationElement
                  {...tempLocation}
                />
              )}
            </View>
          </Pressable>
        ) : (
          <View style={styles.searchResult}>
            {isZipCodeValid(userInput) && (<Text>
              No results found.
            </Text>)}
          </View>
        )}

        <Text style={{ fontSize: 20, marginBottom: 26 }}>
          Favorites:
        </Text>

        <View style={styles.favorites}>
          {favoriteElements}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: "white",
  },
  searchIcon: {
    marginLeft: 7,
    marginRight: 18,
  },
  searchBar: {
    color: "#AAAAAA",
    fontFamily: "Inter",
    fontSize: 14,
  },
  searchBarContainer: {
    borderRadius: 4,
    width: 235,
    height: 35,
    backgroundColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
  },
  searchBarRowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: "#0A84FF",
    fontSize: 14,
    fontFamily: "Inter",
    marginRight: 18,
  },
  searchResult: {
    justifyContent: 'center',
    borderColor: "#CCCCCC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: 48,
    marginBottom: 43,
  },
  favorites: {
    flex: 1,
  }
})