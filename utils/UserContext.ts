import { createContext } from "react";
import { UserContextType, FavoriteItem } from "./utils";


const UserContext = createContext<UserContextType>({
  userInput: "",
  setUserInput: (newInput) => {},
  unit: "imperial",
  setUnit: (newUnit) => {},
  favorites: [],
  setFavorites: (newFavorites) => {}
});

export default UserContext;