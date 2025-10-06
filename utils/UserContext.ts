import { createContext } from "react";
import { UserContextType, FavoriteItem } from "./utils";
import { lightTheme } from "@/constants/Color";


const UserContext = createContext<UserContextType>({
  userInput: "",
  setUserInput: (newInput) => {},
  unit: "imperial",
  setUnit: (newUnit) => {},
  favorites: [],
  setFavorites: (newFavorites) => {},
  scheme: lightTheme,
});

export default UserContext;