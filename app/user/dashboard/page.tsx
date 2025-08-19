import PageHeader from '@/components/user/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserDashboard() {
  return (
    <ProtectedRoute>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to your personal dashboard" 
      />
    </ProtectedRoute>
  );
}