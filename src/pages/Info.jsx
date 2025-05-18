import React, { useState } from "react";

export function Info() {
  // Lista kuvien tiedostonimistä
  const images = Array.from({ length: 23 }, (_, i) => `rend${i + 1}.png`);
  // Valittu kuvan indeksi, aluksi 0 eli rend1.png
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Vaihda edelliseen kuvaan (kierto)
  const prevImage = () => {
    setSelectedIndex((selectedIndex + images.length - 1) % images.length);
  };
  // Vaihda seuraavaan kuvaan (kierto)
  const nextImage = () => {
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  return (
    <div className="pt-16 px-4">
      <h3 className="text-center font-bold text-6xl mb-8">Tietoa</h3>

      {/* Yläpuolella thumbnail-putki */}
      <div className="flex flex-row flex-nowrap space-x-4 overflow-x-auto">
        {images.map((file, idx) => (
          <figure
            key={file}
            className={`flex-shrink-0 text-center cursor-pointer ${idx === selectedIndex ? 'opacity-100' : 'opacity-60'}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <img
              className="w-32 h-auto block"
              src={`/imgs/all/${file}`}
              alt={file}
            />
            <figcaption className="mt-2 text-sm">
              {file.replace('.png', '')}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Alapuolella preview, jossa vasen/oikea nuoli */}
      <div className="relative flex items-center justify-center pt-8">
        <button
          onClick={prevImage}
          className="absolute left-0 ml-2 text-3xl font-bold text-gray-700 hover:text-gray-900"
        >
          ‹
        </button>

        <img
          src={`/imgs/all/${images[selectedIndex]}`}
          alt={images[selectedIndex]}
          className="max-w-[70vw] max-h-[50vh] rounded-lg shadow-lg"
        />

        <button
          onClick={nextImage}
          className="absolute right-0 mr-2 text-3xl font-bold text-gray-700 hover:text-gray-900"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default Info;
