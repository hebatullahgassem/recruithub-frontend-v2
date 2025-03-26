import { createContext, useEffect, useState } from "react";

export const userContext = createContext();

export function UserContextProvider({ children }) {
  let [token, setToken] = useState(null);
  let [user, setUser] = useState(null);
  // let [isOpen,setOpen] = useState(false)
  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (tok) setToken(tok);
  }, []);
  return (
    <userContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
