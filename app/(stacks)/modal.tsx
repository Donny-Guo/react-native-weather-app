import FavoriteElement from '@/components/FavoriteElement';
import LocationElement from '@/components/LocationElement';
import UserContext from '@/utils/UserContext';
import WeatherContext from '@/utils/WeatherContext';
import { CurrentLocation, deleteFavorite, fetchLocationData } from '@/utils/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ModalPage() {
  const router = useRouter();
  const isZipCodeValid = (s: string) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(s);
  const { userInput, setUserInput, favorites, setFavorites, scheme } = useContext(UserContext);
  const { getForecastWeatherData } = useContext(WeatherContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempLocation, setTempLocation] = useState<CurrentLocation | null>(null)

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.modalContainer, {
        backgroundColor: scheme.background,
      }]}>
        <View style={styles.searchBarRowContainer}>
          <View style={[styles.searchBarContainer, {
            backgroundColor: scheme.searchBarContainer
          }]}>
            <FontAwesome name="search" size={15.6} color="#AAAAAA" style={styles.searchIcon} />
            <TextInput
              style={[styles.searchBar, {
                color: scheme.searchBarText
              }]}
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

        <Text style={{
          fontSize: 20, marginBottom: 18, marginTop: 27,
          color: scheme.text
        }}>
          Search Results:
        </Text>


        {isZipCodeValid(userInput) && tempLocation ? (
          <Pressable onPress={async () => {
            setUserInput("");
            await getForecastWeatherData(tempLocation.zipCode);
            router.back();
          }}>
            <View style={[styles.searchResult, {
              borderColor: scheme.borderColor
            }]}>
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
          <View style={[styles.searchResult, {
            borderColor: scheme.borderColor
          }]}>
            {isZipCodeValid(userInput) && (
                <Text style={{ color: scheme.text }}>
                No results found.
              </Text>)}
          </View>
        )}

        <Text style={{ fontSize: 20, marginBottom: 26, color: scheme.text}}>
          Favorites:
        </Text>

        <View style={styles.favorites}>
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
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
            )}
          />
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
  },
  searchIcon: {
    marginLeft: 7,
    marginRight: 18,
  },
  searchBar: {
    fontFamily: "Inter",
    fontSize: 14,
  },
  searchBarContainer: {
    borderRadius: 4,
    width: 235,
    height: 35,
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