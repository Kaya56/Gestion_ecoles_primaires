import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

// Navigation component 
const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/eleves", label: "Élèves" },
    { to: "/enseignants", label: "Enseignants" },
    { to: "/classes", label: "Classes" },
    { to: "/parametres", label: "Paramètres" },
];

const Navigation: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="navigation">
            <ul>
                {navLinks.map((link) => (
                    <li
                        key={link.to}
                        className={location.pathname === link.to ? "active" : ""}
                    >
                        <Link to={link.to}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;