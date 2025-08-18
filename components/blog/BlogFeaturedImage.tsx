interface BlogFeaturedImageProps {
  src: string;
  alt: string;
}

export default function BlogFeaturedImage({ src, alt }: BlogFeaturedImageProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative size-full">
      <div className="box-border content-stretch flex flex-col items-start justify-start max-w-[1440px] px-16 py-8 relative shrink-0 w-full">
        <div
          className="bg-center bg-cover bg-no-repeat h-[668px] shrink-0 w-full rounded-lg overflow-hidden"
          style={{ backgroundImage: `url('${src}')` }}
          role="img"
          aria-label={alt}
        />
      </div>
    </div>
  );
}