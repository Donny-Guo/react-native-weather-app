import { View, Text, StyleSheet, Image } from 'react-native';
import {
  type Unit, TEMPERATURE_UNIT, ForecastWeather,
} from "../utils/utils";
import dayjs from "dayjs";

interface DayWeatherElementProps {
  dayForecast: ForecastWeather,
  unit: Unit,
}

export default function DayWeatherElement({ dayForecast, unit}: DayWeatherElementProps) {
  const {date, minTemp, maxTemp, iconLink} = dayForecast;

  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={styles.normalText}>
          {dayjs(date).format("MMM DD")}
        </Text>
      </View>
      
      <View style={[styles.cell, {
        marginLeft: 24,
      }]}>
        <Image
          style={{ width: 32, height: 32 }}
          source={{ uri: iconLink }}
        />
      </View>
      

      <View style={[styles.cell, {
        flex: 1.4
      }]}>
        <Text style={styles.normalText}>
          {maxTemp}{TEMPERATURE_UNIT[unit]}
        </Text>
      </View>
      

      <View style={styles.cell}>
        <Text style={styles.minTempText}>
          {minTemp}{TEMPERATURE_UNIT[unit]}
        </Text>
      </View>
      
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
    paddingRight: 10,
    justifyContent: "space-between",
    alignItems: "center"
  },
  cell: {
    flex: 1,
    alignItems: "flex-start",
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