import ProtectedRoute from '@/components/ProtectedRoute';
import PageHeader from '@/components/user/PageHeader';

export default function UserNightlife() {
  return (
    <ProtectedRoute>
      <PageHeader 
        title="Nightlife Spots" 
        subtitle="Manage your nightlife venues and reviews" 
      />
    </ProtectedRoute>
  );
}