import ProtectedRoute from '@/components/ProtectedRoute';
import PageHeader from '@/components/user/PageHeader';

export default function UserEvents() {
  return (
    <ProtectedRoute>
      <PageHeader 
        title="Events" 
        subtitle="Manage your events and track attendance" 
      />
    </ProtectedRoute>
  );
}