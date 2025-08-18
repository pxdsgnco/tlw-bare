import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserBlog() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">/user/blog</h1>
      </div>
    </ProtectedRoute>
  );
}