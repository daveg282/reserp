import { Plus, Download } from 'lucide-react';
import UserCard from './UserCard';
import PageHeader from './PageHeader';

export default function StaffView({ users = [], deleteUser }) {
  const handleAddStaff = () => {
    console.log('Add staff clicked');
    // Implementation for adding staff
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implementation for export
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Staff Management"
        actions={[
          {
            icon: Plus,
            label: 'Add Staff',
            onClick: handleAddStaff,
            variant: 'primary'
          },
          {
            icon: Download,
            label: 'Export',
            onClick: handleExport,
            variant: 'secondary'
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {users.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-600">Try adding some staff members or adjust your search</p>
          </div>
        ) : (
          users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              deleteUser={deleteUser}
            />
          ))
        )}
      </div>
    </div>
  );
}