import LocationElement from '@/components/LocationElement';
import InputContext from '@/utils/UserContext';
import WeatherContext from '@/utils/WeatherContext';
import { CurrentLocation, fetchForecastData, fetchLocationData, ForecastWeather, Unit } from '@/utils/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ModalPage() {
  const router = useRouter();
  const isZipCodeValid = (s: string) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(s);
  const { userInput, setUserInput } = useContext(InputContext);
  const { setWeatherData } = useContext(WeatherContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);

  // if zipcode is valid: get current weather -> check if zipcode exists
  useEffect(() => {
    const getLocationData = async (zipCode: string) => {
      setLoading(true);
      const response = await fetchLocationData(zipCode);
      setCurrentLocation(response);
      if (response === null) {
        console.log("no results found");
      } else {
        console.log("current location:", response);
      }
      setLoading(false);
    }
    if (isZipCodeValid(userInput)) {
      getLocationData(userInput);
    }
  }, [userInput]);

  const getForecastWeatherData = async () => {
    if (currentLocation != null) {
      const forecastData = await fetchForecastData(currentLocation?.zipCode);
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
      }
      const data = {
        forecastWeather,
        currentWeather,
        currentLocation
      }
      setWeatherData(data);
    }
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


        {isZipCodeValid(userInput) && currentLocation ? (
          <Pressable onPress={() => {
            setUserInput("");
            getForecastWeatherData();
            router.back();
          }}>
            <View style={styles.searchResult}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <LocationElement
                  {...currentLocation}
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
          {/* {favoriteElements} */}
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