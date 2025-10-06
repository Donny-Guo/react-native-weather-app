import { Stack } from "expo-router";
import UserContext from "@/utils/UserContext";
import { useContext } from "react";

const MainLayout = () => {
  const {scheme} = useContext(UserContext);
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: scheme.background,
      },
      headerTintColor: scheme.text
    }}>
      <Stack.Screen name='index' options={{
        headerShown: false,
        headerTitle: "Weather",
        
      }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerTitle: "Search by Zip Code"
        }}
      />
    </Stack>
  )
}

export default MainLayout