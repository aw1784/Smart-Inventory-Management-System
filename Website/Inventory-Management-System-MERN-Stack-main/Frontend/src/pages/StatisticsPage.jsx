import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PageHeader from '../components/layout/PageHeader.jsx';
import StatsSummary from '../components/Statistics/StatsSummary.jsx';
import OrderStats from '../components/Statistics/OrderStats.jsx';
import UserStats from '../components/Statistics/UserStats.jsx';
import InventoryStats from '../components/Statistics/InventoryStats.jsx';
import {
  fetchSummary,
  fetchOrderStats,
  fetchUserStats,
  fetchInventoryStats,
} from '../store/statisticsSlice.js';

export default function StatisticsPage() {
  const dispatch = useDispatch();

  const refresh = () => {
    dispatch(fetchSummary());
    dispatch(fetchOrderStats());
    dispatch(fetchUserStats());
    dispatch(fetchInventoryStats());
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30000); // auto-refresh every 30s
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Live aggregated statistics across all microservices."
        actions={
          <button onClick={refresh} className="btn-primary">
            <span>↻</span> Refresh
          </button>
        }
      />
      <StatsSummary />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <OrderStats />
        <UserStats />
        <InventoryStats />
      </div>
    </div>
  );
}
