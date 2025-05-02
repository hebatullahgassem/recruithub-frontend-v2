import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import Loading from "../pages/helpers/Loading";

const AdminProtected = ({ children }) => {
    const { user, loading } = useContext(userContext);

    if (loading) return <Loading />; // Or use a spinner
  
    if (!user || user?.user_type !== "ADMIN") {
      return <Navigate to="/login" replace />;
    }
  
  
    return <>{children}</>;
}

export default AdminProtected;
