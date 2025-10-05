import Drawer from "expo-router/drawer";
import React from "react";

const RootLayout = () => {
  return (
    <Drawer>
      <Drawer.Screen name="(stacks)" options={{ drawerLabel: "Weather", title: "Weather" }} />
      <Drawer.Screen name="manage-favorites-page" options={{drawerLabel: "Manage Favorites"}}/>
    </Drawer>
  );
};

export default RootLayout;