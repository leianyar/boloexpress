import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cakes from "./pages/Cakes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/bolos" element={<Cakes />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Register />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/minhas-encomendas"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute onlyAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;