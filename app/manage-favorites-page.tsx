import { StyleSheet, FlatList, View } from 'react-native'
import React from 'react';
import UserContext from '@/utils/UserContext';
import { useContext } from 'react';
import FavoriteElement from '@/components/FavoriteElement';
import { deleteFavorite } from '@/utils/utils';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WeatherContext from '@/utils/WeatherContext';

export default function ManageFavoritesPage() {
  const { favorites, setFavorites } = useContext(UserContext);
  const {getForecastWeatherData} = useContext(WeatherContext);
  const router = useRouter();
  const {bottom, left, right} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
    }]}>
      <FlatList 
        data={favorites}
        renderItem={({item}) => (
          <FavoriteElement key={item.zipCode} {...item}
            onDelete={async () => {
              const newFavorites = favorites.filter(favorite => favorite.zipCode !== item.zipCode);
              setFavorites(newFavorites);
              await deleteFavorite(item.zipCode);
            }}
            onPressFavorite={async () => {
              await getForecastWeatherData(item.zipCode);
              router.replace('/(stacks)');
            }}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
  }
})