import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrdersAction } from "../../redux/adminSlice";
import ListOrders from "../ListOrders/ListOrders.jsx";
import styles from "./Orders.module.css";

const Orders = () => {
  const dispatch = useDispatch();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");

  const allOrders = useSelector((state) => state.adminReducer.allOrders);

  useEffect(() => {
    dispatch(getAllOrdersAction());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterStatus(selectedFilter);
  };

  const handlePaymentFilterChange = (e) => {
    const selectedPaymentFilter = e.target.value;
    setFilterPaymentStatus(selectedPaymentFilter);
  };

  const filteredOrders = allOrders.filter((order) => {
    if (filterStatus && order.order_status !== filterStatus) {
      return false;
    }

    if (filterPaymentStatus && order.status !== filterPaymentStatus) {
      return false;
    }

    return true;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nuestras Ordenes</h2>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filterPaymentStatus}
          onChange={handlePaymentFilterChange}
        >
          <option value="">Estado de Pago</option>
          <option value="approved">Aprobado</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>
        <select
          className={styles.select}
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="">Estado de Orden</option>
          <option value="Procesando">Procesando</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Pago</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((o) => (
            <ListOrders
              key={o?.id}
              id={o?.id}
              User_name={o?.User.name}
              total_price={o?.total_price}
              createdAt={o?.createdAt}
              status={o?.status}
              order_status={o?.order_status}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
