import React from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import ProductList from '../components/Products/ProductList.jsx';

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="Products" subtitle="Catalog of items you can sell." />
      <ProductList />
    </div>
  );
}
