import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  type Unit, TEMPERATURE_UNIT, SPEED_UNIT, CurrentWeather, CurrentLocation,
  ForecastWeather, ForecastData, FavoriteItem,
  fetchFavorites, postFavorite, deleteFavorite, fetchForecastData
} from "../utils";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DayWeatherElement from './DayWeatherElement';
import { useState } from 'react';

interface props {
  currentWeather: Record<Unit, CurrentWeather>,
  currentLocation: CurrentLocation,
  forecastWeather: Record<Unit, ForecastWeather[]>,
  unit: Unit,
  favorites: FavoriteItem[],
  url: string,
  onAddFavorite: () => Promise<void>,
  onRemoveFavorite: (id: string, url: string) => Promise<void>,
}
export default function WeatherElement({ currentWeather, currentLocation, forecastWeather, unit, favorites, url, onAddFavorite, onRemoveFavorite }: props) {
  const [currentUnit, setCurrentUnit] = useState<Unit>(unit);
  const index = favorites.findIndex(item => item.zipCode === currentLocation.zipCode)
  let isFavorite: boolean = false;
  if (index != -1) {
    isFavorite = true;
  }

  const handleFavorite = async () => {
    if (isFavorite) {
      onRemoveFavorite(String(favorites[index]['id']), url);
    } else {
      onAddFavorite();
    }
  }

  return (
    <ScrollView>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.currentTempText}>
          {currentWeather[currentUnit]['temp']}{TEMPERATURE_UNIT[currentUnit]}
        </Text>

        <Text style={styles.feelslikeTempText}>
          Feels like {currentWeather[currentUnit]['feelslike']}{TEMPERATURE_UNIT[currentUnit]}
        </Text>

        <Text style={styles.nameText}>
          {currentLocation['name']}
        </Text>

        <Text style={styles.regionText}>
          {currentLocation['region']}
        </Text>

        <Pressable onPress={handleFavorite}>
          <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", marginTop: 38, marginBottom: 40, height: 19}}>
            {isFavorite
              ? <MaterialIcons name="favorite" size={14} color="#FF0000" />
              : <>
                  <MaterialIcons name="favorite-border" size={14} color="#FF0000" />
                  <Text style={styles.addFavoriteText}>
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
              {currentWeather[currentUnit]['sunrise'].replace(" ", "")}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 11, alignItems: "center" }}>
            <Text style={styles.attributeText}>
              Sunset:
            </Text>
            <Text style={styles.valueText}>
              {currentWeather[currentUnit]['sunset'].replace(" ", "")}
            </Text>
          </View>
        </View>

        <View style={[styles.currentWeatherRow, { marginTop: 11, justifyContent: "center", alignItems: "center" }]}>
          <Text style={[styles.attributeText, { marginRight: 36 }]}>
            Wind:
          </Text>
          <Text style={styles.valueText}>
            {currentWeather[currentUnit]['wind']}
          </Text>
          <Text style={[styles.valueText, { marginLeft: 25 }]}>
            {SPEED_UNIT[currentUnit]}
          </Text>
          <Text style={[styles.speedDirText, { marginLeft: 8 }]}>
            {currentWeather[currentUnit]['wind_dir']}
          </Text>
        </View>

        <Text style={styles.threeDayForecastText}>
          3 Day Forecast
        </Text>

        {forecastWeather[currentUnit].map(item => (
          <DayWeatherElement key={item['date']} dayForecast={item} unit={currentUnit} />
        ))}

        <Pressable
          onPress={(e) => setCurrentUnit(prev => {
            if (prev === "imperial") {
              return "metric";
            } else {
              return "imperial";
            }
          })}
          style={{ marginTop: 30, }}
        >
          <Text style={styles.switchUnitText}>
            Switch to {currentUnit === "imperial" ? "Metric" : "Imperial"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  currentTempText: {
    fontFamily: "Inter",
    fontSize: 48,
    marginTop: 22,
  },
  feelslikeTempText: {
    fontFamily: "Inter",
    fontSize: 20,
    marginTop: 20,
  },
  nameText: {
    fontFamily: "Inter",
    fontSize: 32,
    marginTop: 34,
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
    width: 358,
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