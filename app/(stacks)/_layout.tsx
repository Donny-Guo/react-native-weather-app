import { Stack } from "expo-router"

const MainLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
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