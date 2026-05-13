import React, { useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { useDispatch, useSelector } from "react-redux";
import { getBestSellersAction, setQuantityCase } from "../../redux/adminSlice";
import styles from "./PieChart.module.css";
const PieChart = () => {
  // const data = [
  //     { id: 'Pasta de camarones y vino blanco', label: 'Pasta de camarones y vino blanco', value: 35 },
  //     { id: 'Costillas de cerdo BBQ', label: 'HamCostillas de cerdo BBQ', value: 45 },
  //     { id: 'Asado de tira al chimichurri', label: 'Asado de tira al chimichurri', value: 20 },
  //   ];
  const dispatch = useDispatch();
  const quantityOfBestSellers = useSelector(
    (state) => state.adminReducer.quantityOfBestSellers
  );
  const bestSellers = useSelector((state) => state.adminReducer.bestSellers);
  useEffect(() => {
    dispatch(getBestSellersAction(quantityOfBestSellers));
  }, [quantityOfBestSellers]);

  const handleChange = async (event) => {
    const { value } = event.target;
    dispatch(setQuantityCase(value));
  };
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <span className={styles.label}>Mostrar top:</span>
        <select
          onChange={handleChange}
          value={quantityOfBestSellers}
          className={styles.select}
        >
          <option value="3">3 productos</option>
          <option value="6">6 productos</option>
          <option value="9">9 productos</option>
        </select>
      </div>
      <div className={styles.chartWrapper}>
        {!bestSellers.message ? (
          <ResponsivePie
            data={bestSellers || []}
            margin={{ top: 20, right: 120, bottom: 20, left: 0 }}
            innerRadius={0.6}
            padAngle={2}
            cornerRadius={8}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'set3' }}
            borderWidth={0}
            enableArcLinkLabels={true}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#64748b"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            legends={[
              {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 12,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#64748b',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
              }
            ]}
          />
        ) : (
          <div className={styles.emptyState}>{bestSellers.message}</div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
