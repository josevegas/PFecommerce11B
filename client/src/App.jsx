import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./App.css";
import Nav from "./clientComponents/Nav/Nav.jsx";
import Detail from "./clientViews/Detail/Detail.jsx";
import Home from "./clientViews/Home/Home.jsx";
import NotFound from "./clientViews/NotFound/NotFound.jsx";
import Footer from "./clientComponents/Footer/Footer.jsx";
import EditForm from "./adminViews/EditFood/EditFood";
import AdminPanel from "./adminViews/AdminPanel/AdminPanel";
import CreateFood from "./adminViews/CreateFood/CreateFood";
import ShoppingCar from "./clientViews/ShoppingCar/ShoppingCar";
import Viandas from "./clientViews/Viandas/Viandas";
import PaymentStatus from "./clientViews/PaymentStatus/PaymentStatus";
import OrderDetail from "./adminViews/OrderDetail/OrderDetail";
import UserOrder from "./clientViews/UserOrder/UserOrder";
import UserOrderDetail from "./clientViews/UserOrderDetail/UserOrderDetail";
import MyProfile from "./clientViews/MyProfile/MyProfile.jsx";
import MyFavorites from "./clientViews/MyFavorites/MyFavorites.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getPendingOrderAction } from "./redux/shopingCartSlice";
import { getUserDetailAction } from "./redux/userSlice";

function App() {
  const location = useLocation();

  const { user, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.usersReducer.userDetail);

  useEffect(() => {
    if (isAuthenticated && user) {
      const syncUser = async () => {
        try {
          await axios.post("/user", {
            name: user.name || user.nickname,
            email: user.email,
            type: "Cliente", // Default role
            status: true,
            address: "", // Can be updated later
          });
          // Load user details and pending order after sync
          dispatch(getUserDetailAction(user.email));
          dispatch(getPendingOrderAction(user.email));
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      };
      syncUser();
    }
  }, [isAuthenticated, user, dispatch]);

  const isActualAdmin =
    isAuthenticated && (
      currentUser?.type === "Admin" ||
      user?.email === "viandaexpress84@gmail.com" ||
      user?.email === "thecat_18@hotmail.com"
    );

  return (
    <div className="app">
      {!location.pathname.includes("/admin") && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viandas" element={<Viandas />} />
        <Route path="/micuenta/misdatos" element={<MyProfile />} />
        <Route path="/micuenta/misordenes" element={<UserOrder />} />
        <Route path="/micuenta/misordenes/detalle/:id" element={<UserOrderDetail />} />
        <Route path="/micuenta/misfavoritos" element={<MyFavorites />} />

        <Route path="/detail/:id" element={<Detail />} />
        <Route
          path="/admin/*"
          element={isActualAdmin ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/create"
          element={isActualAdmin ? <CreateFood /> : <Navigate to="/" />}
        />
        <Route
          path="/order/detail/:id"
          element={isActualAdmin ? <OrderDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/edit/:id"
          element={isActualAdmin ? <EditForm /> : <Navigate to="/" />}
        />
        <Route path="/shoppingcart" element={<ShoppingCar />} />
        <Route path="/payment" element={<PaymentStatus />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!location.pathname.includes("/admin") && <Footer />}
    </div>
  );
}

export default App;
