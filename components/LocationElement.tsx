import { View, Text, StyleSheet } from 'react-native';

export default function LocationElement({name, region, zipCode}: { name: string, region: string, zipCode: string }) {
  return (
    <View>
      <Text style={styles.cityText}>
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
    color: "#0C0C0C",
  },
  stateText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#AAAAAA",
  }
})