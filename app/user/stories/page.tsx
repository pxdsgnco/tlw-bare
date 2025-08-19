import ProtectedRoute from '@/components/ProtectedRoute';
import PageHeader from '@/components/user/PageHeader';

export default function UserStories() {
  return (
    <ProtectedRoute>
      <PageHeader 
        title="Stories Management" 
        subtitle="Create and manage stories that appear on the homepage" 
      />
    </ProtectedRoute>
  );
}