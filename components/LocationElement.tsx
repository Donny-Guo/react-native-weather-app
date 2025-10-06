import { View, Text, StyleSheet } from 'react-native';
import UserContext from '@/utils/UserContext';
import { useContext } from 'react';

export default function LocationElement({name, region, zipCode}: { name: string, region: string, zipCode: string }) {
  const {scheme} = useContext(UserContext);
  return (
    <View>
      <Text style={[styles.cityText, {
        color: scheme.text
      }]}>
        {name}
      </Text>
      <Text style={styles.stateText}>
        {`${region} (${zipCode})`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cityText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "bold",
  },
  stateText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#AAAAAA",
  }
})