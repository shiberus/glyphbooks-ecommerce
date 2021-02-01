import React from "react";
import UserSidebar from "./userSidebar.jsx";
import UserDetails from "./userDetails.jsx";
import UserOrders from "./userOrders.jsx";
import OrderDetails from "../Admin/orderDetails";
import { Switch, Route, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import style from "../../CSS/User.module.scss";

export default function User({ logOut, setLocalUser, localUser }) {
  const { user } = useSelector((state) => state.user);
  const { replace } = useHistory();
  return (
    <div className={style.container}>
      <UserSidebar
        user={user}
        logOut={() => {
          logOut();
          replace("/");
        }}
      />
      <Switch>
        <Route
          path="/cuenta/details"
          render={() => (
            <UserDetails
              user={user}
              setLocalUser={setLocalUser}
              localUser={localUser}
            />
          )}
        />
        <Route
          path="/cuenta/orders"
          render={() => <UserOrders user={user} />}
        />
        <Route
          path={"/cuenta/orderDetails"}
          render={() => <OrderDetails user={user} />}
        />
      </Switch>
    </div>
  );
}
