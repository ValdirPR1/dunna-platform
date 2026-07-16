"use client";

import { useState } from "react";

interface Props {
  images: string[];
}

export default function ImageGallery({ images }: Props) {
  const [principal, setPrincipal] = useState(0);

  return (
    <section className="grid grid-cols-[1fr_120px] gap-3">

      <img
        src={images[principal]}
        alt="Foto principal"
        className="h-[560px] w-full rounded-3xl object-cover"
      />

      <div className="flex h-[560px] flex-col gap-3 overflow-y-auto pr-1">

        {images.map((url, index) => (

          <button
            key={index}
            type="button"
            onClick={() => setPrincipal(index)}
            className={`shrink-0 overflow-hidden rounded-2xl transition ${
              index === principal
                ? "ring-2 ring-gold"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={url}
              alt={`Foto ${index + 1}`}
              className="h-28 w-full object-cover"
            />
          </button>

        ))}

      </div>

    </section>
  );
}
