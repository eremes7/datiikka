import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'

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
                console.log(show)
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={`
        bg-white fixed inset-x-0 top-0 h-16 z-[9999]
        shadow transition-transform duration-300
        ${show ? 'translate-y-0' : '-translate-y-full'}
      `}
        >
            <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
                {/* Vasemman laidan linkit, välissä 24px tilaa */}
                <div className="flex items-center space-x-6">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : ''}>
                        Etusivu
                    </NavLink>
                    <NavLink to="/shelfconfigurator" className={({ isActive }) => isActive ? 'font-bold' : ''}>
                        Shelf
                    </NavLink>
                    <NavLink to="/testScene" className={({ isActive }) => isActive ? 'font-bold' : ''}>
                        TestScene
                    </NavLink>
                </div>

                {/* Oikeaan reunaan dropdown-placeholder */}
                <div>
                    <select
                        disabled
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white cursor-not-allowed"
                    >
                        <option>Suomi</option>
                        <option>English</option>
                    </select>
                </div>
            </div>
        </nav>
    )
} 