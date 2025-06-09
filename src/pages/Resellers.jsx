import React, { useState } from "react";

export function Resellers() {
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
            Kaka on the snow
    </div>
  );
}

export default Resellers;
