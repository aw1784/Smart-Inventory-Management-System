import React from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import InventoryList from '../components/Inventory/InventoryList.jsx';

export default function InventoryPage() {
  return (
    <div>
      <PageHeader title="Inventory" subtitle="Stock levels per product and warehouse." />
      <InventoryList />
    </div>
  );
}
