import React from "react";
import style from "../SideBar/SideBar.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOption } from "../../redux/adminSlice";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOption = useSelector(
    (state) => state.adminReducer.sidebarOption
  );
  const handleOptionSelect = (option) => {
    navigate("/admin");
    dispatch(setSidebarOption(option));
  };
  const currentUser = useSelector((state) => state.usersReducer.userDetail);

  return (
    <div className={style.sidebar}>
      <div className={style.userProfile}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          {currentUser?.name?.[0] || user?.nickname?.[0] || 'A'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser?.name || user?.nickname || 'Admin'}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser?.email}
          </p>
        </div>
      </div>
      <ul>
        <li>
          <div
            className={
              style.option +
              (sidebarOption === "dashboard" ? " " + style.activeOption : "")
            }
            onClick={() => handleOptionSelect("dashboard")}
          >
            <FontAwesomeIcon icon={faHouse} className={style.sep} />
            {' '}Tablero
          </div>
        </li>

        <li>
          <div
            className={
              style.option +
              (sidebarOption === "orders" ? " " + style.activeOption : "")
            }
            onClick={() => handleOptionSelect("orders")}
          >
            <FontAwesomeIcon icon={faList} className={style.sep} />
            {' '}Órdenes
          </div>
        </li>

        <li>
          <div
            className={
              style.option +
              (sidebarOption === "products" ? " " + style.activeOption : "")
            }
            onClick={() => handleOptionSelect("products")}
          >
            <FontAwesomeIcon icon={faStore} className={style.sep} />
            {' '}Viandas
          </div>
        </li>

        <li>
          <div
            className={
              style.option +
              (sidebarOption === "reviews" ? " " + style.activeOption : "")
            }
            onClick={() => handleOptionSelect("reviews")}
          >
            <FontAwesomeIcon icon={faBook} className={style.sep} />
            {' '}Reseñas
          </div>
        </li>
        <li>
          <div
            className={
              style.option +
              (sidebarOption === "users" ? " " + style.activeOption : "")
            }
            onClick={() => handleOptionSelect("users")}
          >
            <FontAwesomeIcon icon={faUser} className={style.sep} />
            {' '}Usuarios
          </div>
        </li>

        <Link className={style.link} to="/">
          <div className={`${style.option} ${style.clientOption}`}>
            <FontAwesomeIcon icon={faUsers} className={style.sep} />
            {' '}Cambiar a vista Cliente
          </div>
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
