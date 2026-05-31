import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, onlyAdmin = false }) {
  const token = localStorage.getItem("@BoloExpress:token");
  const userData = localStorage.getItem("@BoloExpress:user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (onlyAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;