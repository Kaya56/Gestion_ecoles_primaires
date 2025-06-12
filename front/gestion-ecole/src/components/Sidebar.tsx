import React from 'react';
import { NavLink } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:transform-none lg:static lg:w-64 transition-transform duration-300 ease-in-out z-50`}
      role="navigation"
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold">Navigation</h2>
        <button
          className="lg:hidden text-white mt-2"
          onClick={toggleSidebar}
          aria-label="Fermer le menu"
        >
          Fermer
        </button>
      </div>
      <nav className="mt-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
          onClick={toggleSidebar}
        >
          Tableau de bord
        </NavLink>
        <NavLink
          to="/disciplines"
          className={({ isActive }) =>
            `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
          onClick={toggleSidebar}
        >
          Disciplines
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;