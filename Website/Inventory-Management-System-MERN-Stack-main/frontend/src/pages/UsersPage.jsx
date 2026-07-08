import React from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import UsersList from '../components/Users/UsersList.jsx';
import PermissionsMatrix from '../components/Users/PermissionsMatrix.jsx';

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        title="User management"
        subtitle="Promote, demote, or remove users — and review what each role can do."
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <UsersList />
        </div>
        <div>
          <PermissionsMatrix />
        </div>
      </div>
    </div>
  );
}
