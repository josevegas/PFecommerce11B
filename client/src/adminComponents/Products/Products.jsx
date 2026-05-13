import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListProductsItem from "../ListProductsItam/ListProductsItem.jsx";
import styles from "./Products.module.css"; // Importa el archivo CSS
import { Link } from "react-router-dom";
import SearchBarProducts from "../SearchBarProducts/SearchBarProducts.jsx";
import {
  setCategoryByCase,
  setRenderFoodsCase,
  setSearchedCase,
} from "../../redux/adminSlice.js";

const Products = () => {
  const dispatch = useDispatch();
  const allFoods = useSelector((state) => state.foodsReducer.adminFoods);
  const searched = useSelector((state) => state.adminReducer.searched);
  const categoryBy = useSelector((state) => state.adminReducer.categoryBy);
  const renderFoods = useSelector((state) => state.adminReducer.renderFoods);

  useEffect(() => {
    let result = [...allFoods];

    if (searched) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searched.toLowerCase())
      );
    }

    if (categoryBy && categoryBy !== 'todas') {
      const categoryMap = {
        'carnes': 'Carnes',
        'pastas': 'Pastas',
        'ensaladas': 'Ensaladas',
        'Carnes': 'Carnes',
        'Pastas': 'Pastas',
        'Ensaladas': 'Ensaladas'
      };
      const targetCategory = categoryMap[categoryBy] || categoryBy;
      result = result.filter(food => 
        food.category.toLowerCase() === targetCategory.toLowerCase()
      );
    }

    dispatch(setRenderFoodsCase(result));
  }, [searched, categoryBy, allFoods, dispatch]);

  const handlerChange = (event) => {
    const { value } = event.target;
    dispatch(setCategoryByCase(value));
    dispatch(setSearchedCase(""));
  };

  return (
    <div className={styles.productos}>
      {" "}
      {/* Aplica la clase CSS utilizando la variable styles */}
      <div>
        <h2>Nuestras Viandas</h2>
      </div>
      <div className={styles.addFood}>
        <Link to={"/admin/create"}>
          <button className={styles.viewAllButton}>Agregar Vianda</button>
        </Link>
        <SearchBarProducts />
        <select
          className={styles.viewAllButton}
          value={categoryBy}
          onChange={handlerChange}
        >
          <option value="todas">Todas</option>
          <option value="carnes">Carnes</option>
          <option value="pastas">Pastas</option>
          <option value="ensaladas">Ensaladas</option>
        </select>
      </div>
      <table className={styles.destable}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio Final</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {renderFoods.length > 0 &&
            renderFoods.map((e) => (
              <ListProductsItem
                key={e.id}
                id={e.id}
                name={e.name}
                final_price={e.final_price}
                status={e.status}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
