import { Stack } from "expo-router";

const MainLayout = () => {

  return (
    <Stack>
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