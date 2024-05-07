import { NavLink } from 'react-router-dom';
import '../tyylit/NavBar.css';

const NavBar = ({ user }) => {
    let lista = ["Etusivu", "testiSivut", "Lisää avain","Kirjautuminen"];

    if (user) {
        lista = [...lista, "Lisää teksti", "Kirjaudu ulos"];
    }
    return (
        <nav>
            {lista.map((sivu, index) => (
                <NavLink
                    to={`/${sivu.toLowerCase() === "etusivu" ? "" : sivu.toLowerCase()}`}
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
