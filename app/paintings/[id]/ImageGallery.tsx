"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1" />
          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1" />
          <path d="M21 15l-5-5L5 21" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return (
    <div className="sticky top-24">
      {/* Main image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <Image
          src={images[selected]}
          alt={`${title} - Vista ${selected + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selected === i
                  ? "border-black scale-95"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={url}
                  alt={`${title} miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
