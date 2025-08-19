'use client';

// Figma image assets
const imgFrame130 = "http://localhost:3845/assets/e082d28960cae8df25e6b34174b5e3104581d729.png";
const imgFrame427318960 = "http://localhost:3845/assets/e92bbeabdc9a12d15f841e9faf5982e29ea6c5aa.png";
const imgFrame427318961 = "http://localhost:3845/assets/d37a89481ea529deeaf50034865c73e1d3fae330.png";
const imgFrame427318962 = "http://localhost:3845/assets/7b4aa06550511e90a4f5933d8ae934c06522944a.png";
const imgFrame427318963 = "http://localhost:3845/assets/43bd64922b57058137311f34f633b059dd272ab1.png";

interface NightlifeImageGalleryProps {
  images: string[];
  venueName: string;
}

export default function NightlifeImageGallery({ images: _images, venueName: _venueName }: NightlifeImageGalleryProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative size-full">
      <div
        className="bg-center bg-cover bg-no-repeat h-[573px] shrink-0 w-full"
        style={{ backgroundImage: `url('${imgFrame130}')` }}
      />
      <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full">
        <div
          className="basis-0 bg-center bg-cover bg-no-repeat grow h-[134px] min-h-px min-w-px opacity-40 shrink-0"
          style={{ backgroundImage: `url('${imgFrame130}')` }}
        />
        <div
          className="basis-0 bg-[#e7e7e7] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] grow h-[134px] min-h-px min-w-px shrink-0"
          style={{ backgroundImage: `url('${imgFrame427318960}')` }}
        />
        <div
          className="basis-0 bg-[#e7e7e7] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] grow h-[134px] min-h-px min-w-px shrink-0"
          style={{ backgroundImage: `url('${imgFrame427318961}')` }}
        />
        <div
          className="basis-0 bg-[#e7e7e7] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] grow h-[134px] min-h-px min-w-px shrink-0"
          style={{ backgroundImage: `url('${imgFrame427318962}')` }}
        />
        <div
          className="basis-0 bg-[#e7e7e7] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] grow h-[134px] min-h-px min-w-px shrink-0"
          style={{ backgroundImage: `url('${imgFrame427318963}')` }}
        />
      </div>
    </div>
  );
}