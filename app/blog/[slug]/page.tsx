import BlogDetailsPage from '@/components/blog/BlogDetailsPage';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailsPage slug={slug} />;
}