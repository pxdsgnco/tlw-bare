import ProtectedRoute from '@/components/ProtectedRoute';
import PageHeader from '@/components/user/PageHeader';

export default function UserPages() {
  return (
    <ProtectedRoute>
      <PageHeader 
        title="Page Management" 
        subtitle="Create and manage static pages and content" 
      />
    </ProtectedRoute>
  );
}