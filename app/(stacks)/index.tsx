import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function InitialScreen() {
  const router = useRouter();


  return (

    <View style={styles.container}>
      <Pressable onPress={() => {
        router.push("/modal");
      }}>
        <View style={styles.searchBarContainer}>
          <FontAwesome name="search" size={15.6} color="#AAAAAA" style={styles.searchIcon} />
          <Text style={styles.searchBar}>
            Enter a Zip Code
          </Text>
        </View>
      </Pressable>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  searchBarContainer: {
    borderRadius: 4,
    width: 235,
    height: 35,
    backgroundColor: "#EEEEEE",
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