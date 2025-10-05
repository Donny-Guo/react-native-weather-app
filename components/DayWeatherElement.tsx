import { View, Text, StyleSheet, Image } from 'react-native';
import {
  type Unit, TEMPERATURE_UNIT, ForecastWeather,
} from "../utils";
import dayjs from "dayjs";

interface DayWeatherElementProps {
  dayForecast: ForecastWeather,
  unit: Unit,
}

export default function DayWeatherElement({ dayForecast, unit}: DayWeatherElementProps) {
  const {date, minTemp, maxTemp, iconLink} = dayForecast;

  return (
    <View style={styles.container}>
      <Text style={styles.normalText}>
        {dayjs(date).format("MMM DD")}
      </Text>

      <Image 
        style={{width: 32, height: 32}}
        source={{ uri: iconLink}}
      />

      <Text style={styles.normalText}>
        {maxTemp}{TEMPERATURE_UNIT[unit]}
      </Text>

      <Text style={styles.minTempText}>
        {minTemp}{TEMPERATURE_UNIT[unit]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 52,
    backgroundColor: '#C3E1FF',
    flexDirection: 'row',
    marginBottom: 9,
    paddingLeft: 30,
    paddingRight: 34,
    justifyContent: "space-between",
    alignItems: "center"
  },
  normalText: {
    fontFamily: "Inter",
    fontSize: 20,
    color: "#0C0C0C"
  },
  minTempText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#777777"
  }
})