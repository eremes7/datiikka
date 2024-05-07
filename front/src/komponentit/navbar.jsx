import { NavLink } from 'react-router-dom';
import '../tyylit/NavBar.css';

const NavBar = ({ user }) => {
    let lista = ["Etusivu", "testiSivut", "Lisää avain"];

    if (user) {
        lista = [...lista, "Kirjaudu ulos","Lisää teksti"];
    } else {
        lista = [...lista, "Kirjautuminen"];
    }
    
    return (
        <nav>
            {lista.map((sivu, index) => (
                <NavLink
                    to={sivu.toLowerCase() === "kirjaudu ulos" ? "/Kirjautuminen" : (sivu.toLowerCase() === "etusivu" ? "" : sivu.toLowerCase())}
                    key={index}
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    {sivu}
                </NavLink>
            ))}
        </nav>
    );
}

export default NavBar;
