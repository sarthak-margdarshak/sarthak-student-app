import { createContext } from "react";

export const SnackbarContext = createContext({
  error: [],
  showSnackbar: (errorMessage) => {},
  hideSnackbar: () => {}
})