import { createContext } from "react";

type InputContextType = {
  userInput: string;
  setUserInput: (newValue: string) => void;
};

const InputContext = createContext<InputContextType>({
  userInput: "",
  setUserInput: () => {}
});

export default InputContext;