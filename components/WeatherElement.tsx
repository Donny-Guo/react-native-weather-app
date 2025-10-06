import UserContext from "@/utils/UserContext";
import {
  type Unit,
  CurrentLocation,
  CurrentWeather,
  deleteFavorite,
  ForecastWeather,
  postFavorite,
  SPEED_UNIT,
  TEMPERATURE_UNIT
} from "@/utils/utils";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useContext } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DayWeatherElement from './DayWeatherElement';

interface props {
  currentWeather: Record<Unit, CurrentWeather>,
  currentLocation: CurrentLocation,
  forecastWeather: Record<Unit, ForecastWeather[]>,
  unit: Unit,
  onSwitchUnit: (unit: Unit) => void,
}
export default function WeatherElement({ currentWeather, currentLocation, forecastWeather, unit, onSwitchUnit }: props) {
  const router = useRouter();
  const { favorites, setFavorites, scheme } = useContext(UserContext);
  const index = favorites.findIndex(item => item.zipCode === currentLocation.zipCode)
  const isFavorite: boolean = (index !== -1);


  const handleFavorite = async () => {
    if (isFavorite) { // remove favorites
      const newFavorites = favorites.filter(item => item.zipCode !== currentLocation.zipCode);
      setFavorites(newFavorites);
      await deleteFavorite(currentLocation.zipCode);
    } else { // add favorites
      const { name, region, zipCode } = currentLocation;
      const newFavorites = [...favorites, { name, region, zipCode }];
      setFavorites(newFavorites);
      await postFavorite(zipCode, name, region);
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.currentTempText, {
          color: scheme.searchBarText
        }]}>
          {currentWeather[unit]['temp']}{TEMPERATURE_UNIT[unit]}
        </Text>

        <Text style={[styles.feelslikeTempText, {
          color: scheme.searchBarText
        }]}>
          Feels like {currentWeather[unit]['feelslike']}{TEMPERATURE_UNIT[unit]}
        </Text>

        <Text style={[styles.nameText, {
          color: scheme.searchBarText
        }]}>
          {currentLocation['name']}
        </Text>

        <Text style={[styles.regionText, {
          color: scheme.searchBarText
        }]}>
          {currentLocation['region']}
        </Text>

        <Pressable onPress={handleFavorite}>
          <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 16, height: 19 }}>
            {isFavorite
              ? <MaterialIcons name="favorite" size={14} color="#FF0000" />
              : <>
                <MaterialIcons name="favorite-border" size={14} color="#FF0000" />
                <Text style={[styles.addFavoriteText, {
                  color: scheme.searchBarText
                }]}>
                  Add Favorite
                </Text>
              </>
            }
          </View>
        </Pressable>

        <View style={[styles.currentWeatherRow, { justifyContent: "space-between", alignItems: "center" }]}>
          <View style={{ flexDirection: 'row', columnGap: 11, alignItems: "center" }}>
            <Text style={styles.attributeText}>
              Sunrise:
            </Text>
            <Text style={styles.valueText}>
              {currentWeather[unit]['sunrise'].replace(" ", "")}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 11, alignItems: "center" }}>
            <Text style={styles.attributeText}>
              Sunset:
            </Text>
            <Text style={styles.valueText}>
              {currentWeather[unit]['sunset'].replace(" ", "")}
            </Text>
          </View>
        </View>

        <View style={[styles.currentWeatherRow, { marginTop: 11, justifyContent: "center", alignItems: "center" }]}>
          <Text style={[styles.attributeText, { marginRight: 36 }]}>
            Wind:
          </Text>
          <Text style={styles.valueText}>
            {currentWeather[unit]['wind']}
          </Text>
          <Text style={[styles.valueText, { marginLeft: 25 }]}>
            {SPEED_UNIT[unit]}
          </Text>
          <Text style={[styles.speedDirText, { marginLeft: 8 }]}>
            {currentWeather[unit]['wind_dir']}
          </Text>
        </View>

        <Text style={[styles.threeDayForecastText, {
          color: scheme.searchBarText
        }]}>
          3 Day Forecast
        </Text>

        {forecastWeather[unit].map(item => (
          <Pressable
            onPress={(e) => {
              router.push({
                pathname: "/hourly-forecast",
                params: {
                  date: item['date']
                }
              })
            }}
            key={item['date']}
          >
            <DayWeatherElement dayForecast={item} unit={unit} />
          </Pressable>
        ))}

        <Pressable
          onPress={(e) => {
            if (unit === 'imperial') {
              onSwitchUnit("metric");
            } else {
              onSwitchUnit('imperial');
            }
          }}
          style={{ marginTop: 30, }}
        >
          <Text style={styles.switchUnitText}>
            Switch to {unit === "imperial" ? "Metric" : "Imperial"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 16,
  },
  currentTempText: {
    fontFamily: "Inter",
    fontSize: 48,
    marginTop: 14,
  },
  feelslikeTempText: {
    fontFamily: "Inter",
    fontSize: 20,
    marginTop: 20,
  },
  nameText: {
    fontFamily: "Inter",
    fontSize: 32,
    marginTop: 20,
  },
  regionText: {
    fontFamily: "Inter",
    fontSize: 24,
    marginTop: 15,
  },
  addFavoriteText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#0A84FF",
    marginLeft: 12,
  },
  currentWeatherRow: {
    backgroundColor: "#A7D3FF",
    borderRadius: 10,
    width: "100%",
    height: 51,
    flexDirection: "row",
    paddingHorizontal: 13,
  },
  attributeText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#555555",
  },
  valueText: {
    fontFamily: "Inter",
    fontSize: 20,
    color: "#0C0C0C",
  },
  speedDirText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#0C0C0C",
  },
  threeDayForecastText: {
    fontFamily: "Inter",
    fontSize: 15,
    marginTop: 34,
    marginBottom: 15,
  },
  switchUnitText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#0A84FF",
  },
})