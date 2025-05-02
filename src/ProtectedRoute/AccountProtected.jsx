import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import Loading from "../pages/helpers/Loading";

const AccountProtected = ({ children }) => {
  const { user, loading } = useContext(userContext);
  if (loading) return <Loading />;
  
  if (!user?.user_type ) {

    // return <Navigate to="/login" replace />;
    return <>{children}</>;
  }
   else {
    return <Navigate to="/" replace />
   }
} 
export default AccountProtected;

