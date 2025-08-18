import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserNightlife() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">/user/nightlife</h1>
      </div>
    </ProtectedRoute>
  );
}