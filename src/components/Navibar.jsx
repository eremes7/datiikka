import { useEffect, useState } from 'react';


export default function Navibar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShow(false); // scrollataan alas
      } else {
        setShow(true); // scrollataan ylös tai ollaan ylhäällä
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-white fixed top-0 left-0 w-full h-16 z-[9999] shadow transition-transform duration-300 
      ${show ? 'translate-y-0' : '-translate-y-full'} 
      `}
    >
      <div className="shadow-md px-2 max-w-7xl mx-auto h-full flex items-center ml-0">
        <h1 className="text-lg font-bold">Navigaatio</h1>
      </div>
    </nav>
  );
}
