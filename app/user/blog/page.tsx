import ProtectedRoute from '@/components/ProtectedRoute';
import PageHeader from '@/components/user/PageHeader';

export default function UserBlog() {
  return (
    <ProtectedRoute>
      <PageHeader 
        title="Blog Management" 
        subtitle="Create and manage your blog posts and articles" 
      />
    </ProtectedRoute>
  );
}