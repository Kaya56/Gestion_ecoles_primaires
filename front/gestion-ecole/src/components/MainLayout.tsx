import React, { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header  />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 lg:p-8 bg-white">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>© {new Date().getFullYear()} Gestion des écoles primaires</p>
      </footer>
    </div>
  );
};

export default MainLayout; 