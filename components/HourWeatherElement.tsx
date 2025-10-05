import UserContext from '@/utils/UserContext';
import { HourlyData, TEMPERATURE_UNIT } from '@/utils/utils';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';

export default function HourWeatherElement({ time_epoch, iconLink, temp_c, temp_f, humidity }: HourlyData) {
  const { unit } = useContext(UserContext);
  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={styles.text}>
          {dayjs(time_epoch * 1000).format('h A')}
        </Text>
      </View>

      <View style={styles.cell}>
        <Image
          source={{
            uri: iconLink
          }}
          style={styles.weatherIcon}
        />
      </View>

      <View style={[styles.cell,
        {
          flex: 1.4
        }
      ]}>
        <Text style={styles.text}>
          {
            unit === 'imperial' 
              ? `${temp_f}${TEMPERATURE_UNIT[unit]}`
              : `${temp_c}${TEMPERATURE_UNIT[unit]}`
          }
        </Text>
      </View>

      <View style={[styles.cell]}>
        <Text style={styles.text}>
          {humidity} %
        </Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A7D3FF',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 9,
    paddingLeft: 18,
  },
  cell: {
    flex: 1,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter",
    color: "#0C0C0C",
  },
  weatherIcon: {
    width: 32,
    height: 32,
  }
})