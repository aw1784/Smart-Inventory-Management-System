import React from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import OrderList from '../components/Orders/OrderList.jsx';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" subtitle="Place new orders and update their status." />
      <OrderList />
    </div>
  );
}
