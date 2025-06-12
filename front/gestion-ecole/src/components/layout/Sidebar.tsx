import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import "./Sidebar.css";

// Sidebar component 
const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/", label: "Accueil", icon: <FaHome /> },
        { path: "/eleves", label: "Élèves", icon: <FaUserGraduate /> },
        { path: "/enseignants", label: "Enseignants", icon: <FaChalkboardTeacher /> },
        { path: "/classes", label: "Classes", icon: <FaSchool /> },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Gestion École</h2>
            </div>
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            className={location.pathname === item.path ? "active" : ""}
                        >
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;