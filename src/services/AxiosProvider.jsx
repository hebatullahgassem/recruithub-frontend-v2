import { useContext, useEffect } from "react";
import { setAuthToken } from "./Api";
import { userContext } from "../context/UserContext";

const AxiosProvider = ({ children = null }) => {
  const { token } = useContext(userContext);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return children;
};

export default AxiosProvider;
