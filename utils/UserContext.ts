import { createContext } from "react";
import { UserContextType } from "./utils";


const UserContext = createContext<UserContextType>({
  userInput: "",
  setUserInput: (newInput) => {},
  unit: "imperial",
  setUnit: (newUnit) => {}
});

export default UserContext;