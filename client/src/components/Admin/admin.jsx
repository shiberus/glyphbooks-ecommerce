import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";

import NewCategory from "../Forms/NewCategoryForm";
import AdminProduct from "./adminProduct";
import OrderTable from "./orderTable.jsx";
import AdminUsers from "./adminUsers.jsx";
import UserDetails from "./userDetails.jsx";
import AdmSideBar from "./admSideBar.jsx";
import AdminReviews from "./adminReviews.jsx";
import OrderDetails from "./orderDetails.jsx";
import Crud from "../Forms/CrudProductForm";
import style from "../../CSS/Admin/admin.module.scss";

export default function Admin() {
  const [producto, setProducto] = useState(null);
  const user = useSelector((state) => state.user);
  const { replace } = useHistory();
  useEffect(() => {
    if (!user.user?.isAdmin) replace("/");
  }, [user, replace]);
  return (
    <div className={style.fondo}>
      {user.user?.isAdmin ? (
        <div>
          <AdmSideBar />
          <div className={style.relleno}>
            <Switch>
              <Route path="/admin/orders" render={() => <OrderTable />} />
              <Route
                path="/admin/users"
                render={() => <AdminUsers user={user} />}
              />
              <Route path="/admin/userDetails" render={() => <UserDetails />} />
              <Route path="/admin/reviews" render={() => <AdminReviews />} />
              <Route
                path="/admin/orderDetails"
                render={() => <OrderDetails />}
              />
              <Route
                path="/admin/products"
                render={() => <AdminProduct setProducto={setProducto} />}
              />
              <Route
                path="/admin/crud"
                render={() => (
                  <Crud product={producto} setProduct={setProducto} />
                )}
              />
              <Route path="/admin/newCategory" render={() => <NewCategory />} />
            </Switch>
          </div>
        </div>
      ) : null}
    </div>
  );
}
