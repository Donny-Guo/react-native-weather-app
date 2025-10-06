import WeatherContext from '@/utils/WeatherContext';
import UserContext from '@/utils/UserContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import WeatherElement from '@/components/WeatherElement';
import { FavoriteItem } from '@/utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InitialScreen() {
  const {top, bottom, left, right} = useSafeAreaInsets();
  const router = useRouter();
  const { weatherData: {currentLocation, currentWeather, forecastWeather}} = useContext(WeatherContext);
  const {unit, setUnit, scheme} = useContext(UserContext);

  return (

    <View style={[styles.container, {
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      backgroundColor: scheme.background
    }]}>
      <Pressable onPress={() => {
        router.push("/modal");
      }}>
        <View style={[styles.searchBarContainer, {
          backgroundColor: scheme.searchBarContainer
        }]}>
          <FontAwesome name="search" size={15.6} color="#AAAAAA" style={styles.searchIcon} />
          <Text style={styles.searchBar}>
            Enter a Zip Code
          </Text>
        </View>
      </Pressable>

      {
        (currentLocation != null) && (currentWeather != null) && (forecastWeather != null)
          ? <WeatherElement
            currentLocation={currentLocation}
            currentWeather={currentWeather}
            forecastWeather={forecastWeather}
            unit={unit}
            onSwitchUnit={setUnit}
          />
          : <Text style={{ marginTop: 12, color: scheme.searchBarText}}>
            Touch the search bar to enter a zip code
          </Text>
      }
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    borderRadius: 4,
    width: 235,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
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
})