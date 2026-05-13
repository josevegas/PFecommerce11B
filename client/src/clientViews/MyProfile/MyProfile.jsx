import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailAction } from "../../redux/userSlice";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import styles from "./MyProfile.module.css";
import Swal from "sweetalert2";
import "animate.css";
import logo from "../../assets/logo/LogoViandaExpress.jpeg";
import SidebarUser from "../../clientComponents/SidebarUser/SidebarUser";

const MyProfile = () => {
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.usersReducer.userDetail);
  const [editableField, setEditableField] = useState(false);
  const { user } = useAuth0();
  //Estados locales para guardar la info a editar
  const [address, setAddress] = useState(userDetail?.address || "");
  const [name, setName] = useState(userDetail?.name || user?.name || "");

  useEffect(() => {
    // Si userDetail no tiene propiedades (objeto vacío) o su email no coincide con el logueado, lo traemos
    if (!userDetail || Object.keys(userDetail).length === 0 || userDetail.email !== user?.email) {
      if (user?.email) {
        dispatch(getUserDetailAction(user?.email));
      }
    } else {
      // Sincronizar estados locales cuando llega la info de la DB
      setAddress(userDetail?.address || "");
      setName(userDetail?.name || user?.name || "");
    }
  }, [user, dispatch, userDetail]);


  const handleEdit = () => {
    if (editableField) {
      // Si cancela, restauramos los valores originales
      setAddress(userDetail?.address || "");
      setName(userDetail?.name || user?.name || "");
    }
    setEditableField(!editableField);
  };

  const handleSave = async () => {
    try {
      //Enviamos ambos campos al backend
      await axios.put(`/user/${user?.email}`, { address: address, name: name });
      Swal.fire({
        title: "¡Actualizado!",
        text: "Tus datos se han guardado correctamente.",
        icon: "success",
        confirmButtonColor: "#28a745",
      });
      setEditableField(false);
      dispatch(getUserDetailAction(user?.email));
    } catch (error) {
      window.alert({ error: error.message })
      Swal.fire({
        title: "Error",
        text: "Error de Sistema",
        icon: "error",
        confirmButtonText: "Cerrar",
        footer: "Vianda Express",
        imageUrl: logo,
        toast: true,
        timer: 4000,
        timerProgressBar: true,
        confirmButtonColor: "var(--accentColor)",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  };

  /* RETURN */
  return (
    <main className={styles.mainContainer}>
      <SidebarUser />
      <div className={styles.contentContainer}>
        <h1>Mis datos</h1>
        <section>
          <div className={styles.form}>
            {/* nombre */}
            <div className={styles.rowContainer}>
              <label htmlFor="name">Nombre:</label>
              <br />
              <input
                className={styles.input}
                type="text"
                value={name}
                disabled={!editableField}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {/* email */}
            <div className={styles.rowContainer}>
              <label htmlFor="name">Email de contacto:</label>
              <p name="email">{user?.email}</p>
            </div>

            <div className={styles.rowContainer}>
              <img src={user?.picture} alt="Foto de perfil" className={styles.profileImage} />
            </div>

            {/* address */}
            <div className={styles.rowContainer}>
              <label htmlFor="address">Domicilio de entrega:</label>
              <br />
              <input
                className={styles.input}
                type="text"
                value={address}
                disabled={!editableField}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.editButton} type="button" onClick={handleEdit}>
                {editableField ? "CANCELAR" : "EDITAR PERFIL"}
              </button>

              {editableField && (
                <button className={styles.saveButton} type="button" onClick={handleSave}>
                  GUARDAR CAMBIOS
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyProfile;
