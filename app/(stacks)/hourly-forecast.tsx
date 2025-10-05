import HourWeatherElement from '@/components/HourWeatherElement';
import UserContext from '@/utils/UserContext';
import { HourlyData } from '@/utils/utils';
import WeatherContext from '@/utils/WeatherContext';
import dayjs from "dayjs";
import { useLocalSearchParams } from 'expo-router';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HourlyForecast() {
  const { date } = useLocalSearchParams<{date: string}>();
  const { weatherData: {hourlyForecast} } = useContext(WeatherContext);
  const { unit } = useContext(UserContext);
  const { top, bottom, left, right } = useSafeAreaInsets();
  console.log("date: ", date);
  const timestamp = Math.floor(new Date().getTime() / 1000);
  let filteredData: HourlyData[] = [];

  if (hourlyForecast != null) {
    const dayForecast = hourlyForecast.filter((day) => day['date'] === date);
    if (dayForecast.length > 0) {
      filteredData = dayForecast[0]['hour'].filter(hour => hour['time_epoch'] > timestamp);
    }
  }
  console.log("filtered data: ", filteredData);                 
                        

  return (
    <View style={[styles.container, {
      paddingTop: 10,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
    }]}>
      <Text style={styles.title}>
        {dayjs(date).format("MMM DD")}
      </Text>
      <FlatList
        data={filteredData}
        renderItem={({item}) => (
          <HourWeatherElement {...item}/>
        )}
        style={styles.flatlist}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter",
    color: "#0C0C0C",
    fontWeight: 700,
    marginBottom: 25,
  },
  flatlist: {
    width: '100%',
    paddingHorizontal: 16,
    borderTopColor: '#CCCCCC',
    borderTopWidth: 1,
    paddingTop: 10,
  }
})