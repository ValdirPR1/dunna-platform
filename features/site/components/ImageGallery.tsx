"use client";

interface Props {
  images: string[];
}

export default function ImageGallery({
  images,
}: Props) {
  return (
    <section className="grid gap-3 lg:grid-cols-4">

      <img
        src={images[0]}
        className="col-span-2 h-[520px] w-full rounded-3xl object-cover"
      />

      <div className="grid gap-3">

        {images.slice(1, 3).map((img) => (

          <img
            key={img}
            src={img}
            className="h-[252px] rounded-3xl object-cover"
          />

        ))}

      </div>

      <div className="grid gap-3">

        {images.slice(3, 5).map((img) => (

          <img
            key={img}
            src={img}
            className="h-[252px] rounded-3xl object-cover"
          />

        ))}

      </div>

    </section>
  );
}