import React, { useEffect } from 'react'
import PieChart from './PieChart'
import MyLineChart from './LineChart'
import styles from './DashBoard.module.css'


const DashBoard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de Control</h1>
        <p className={styles.subtitle}>Bienvenido al centro de gestión de ViandaExpress</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#166534' }}>$</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Ventas Totales</span>
            <h3 className={styles.statValue}>$42,500</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#1e40af' }}>🛒</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Órdenes Hoy</span>
            <h3 className={styles.statValue}>18</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#92400e' }}>⭐</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Calificación Prom.</span>
            <h3 className={styles.statValue}>4.8</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#6b21a8' }}>👥</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Nuevos Usuarios</span>
            <h3 className={styles.statValue}>124</h3>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Productos más vendidos</h3>
          <div className={styles.chartWrapper}>
            <PieChart />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Rendimiento de Ventas</h3>
          <div className={styles.chartWrapper}>
            <MyLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard