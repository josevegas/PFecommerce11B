import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getAdminFoodsAction, getFoods } from "../../redux/foodActions.js";
import { useNavigate } from "react-router-dom";
import styles from "./EditFood.module.css";
import Swal from "sweetalert2";
import 'animate.css';
import logo from "../../assets/logo/LogoViandaExpress.jpeg"
import validation from "../CreateFood/validation";
import SideBar from "../../adminComponents/SideBar/SideBar";
import { setCategoryByCase, setSearchedCase } from "../../redux/adminSlice.js";

export default function EditFood() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const allFoods = useSelector((state) => state.foodsReducer.adminFoods);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    initial_price: 0,
    discount: 0,
    status: true,
    description: "",
    category: "",
    diets: [],
    image: null,
  });

  useEffect(() => {
    if (!allFoods.length) {
      dispatch(getAdminFoodsAction());
    }
  }, [dispatch, allFoods.length]);

  useEffect(() => {
    const foodToEdit = allFoods.find((food) => food.id === id);
    if (foodToEdit) {
      setFormData(foodToEdit);
    }
  }, [allFoods, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const validationErrors = validation(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        title: "Por favor corrige los errores",
        icon: "warning",
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará la información de la vianda",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#3b82f6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const form = new FormData();
        for (let key in formData) {
          if (key === 'diets') {
            form.append(key, formData[key]);
          } else {
            form.append(key, formData[key]);
          }
        }
        try {
          await axios.put(`/food/${id}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          dispatch(setSearchedCase(""))
          dispatch(setCategoryByCase(""))
          dispatch(getAdminFoodsAction())
          Swal.fire("¡Éxito!", "Vianda actualizada correctamente", "success");
          navigate("/admin");
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar la vianda", "error");
        }
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  return (
    <main className={styles.mainContainer}>
      <SideBar />
      <div className={styles.contentContainer}>
        <div className={styles.container}>
          <div className={styles.cabecera}>
            <h4>Editar Vianda</h4>
          </div>
          <form className={styles.containergen}>
            <div className={styles.container1}>
              <div className={styles.cont}>
                <h3>Nombre de la Vianda</h3>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inputText}
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                
                <h3>Imagen Actual</h3>
                <img
                  src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                  alt="preview"
                  className={styles.image}
                />
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className={styles.container2}>
              <div className={styles.cont}>
                <h3>Descripción</h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.inputTextArea}
                />
                {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <h3>Precio Base</h3>
                    <input
                      type="number"
                      name="initial_price"
                      value={formData.initial_price}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <h3>Descuento (%)</h3>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <h3>Estado de Disponibilidad</h3>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleSelect}
                >
                  <option value={true}>Habilitado</option>
                  <option value={false}>Deshabilitado</option>
                </select>
              </div>
            </div>
          </form>
          <div className={styles.divbtn}>
            <button className={styles.butedit} onClick={handleEdit}>
              Guardar Cambios
            </button>
            <Link to="/admin" style={{ flex: 1 }}>
              <button className={styles.butedit} style={{ width: '100%' }}>
                Cancelar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
