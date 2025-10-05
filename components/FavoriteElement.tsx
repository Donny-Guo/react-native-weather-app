import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FavoriteItem } from '../utils/utils';
import LocationElement from './LocationElement';

interface FavoriteElementProps extends FavoriteItem {
  onDelete: () => Promise<void>,
  updateInput: () => void,
}

export default function FavoriteElement({ name, region, zipCode, id, onDelete, updateInput }: FavoriteElementProps) {
  return (
    <View style={styles.container}>
      <Pressable style={{ flex: 1, flexDirection: 'row' }} onPress={updateInput}>
        <View>
          <LocationElement name={name} region={region} zipCode={zipCode} />
        </View>
      </Pressable>
      
      <Pressable onPress={(e) => onDelete()}>
        <Text style={styles.buttonText}>Remove</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingLeft: 11,
    paddingRight: 18,
    paddingBottom: 4,
    paddingTop: 6,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  },
  buttonText: {
    color: "#0A84FF",
    fontSize: 16,
    fontFamily: "Inter",
  }
})