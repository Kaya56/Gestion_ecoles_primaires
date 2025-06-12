import React, { type ReactNode, type FC } from 'react';

type LayoutProps = {
    children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => (
    <div>
        <header style={{ padding: '1rem', background: '#1976d2', color: '#fff' }}>
            <h1>Gestion des écoles primaires</h1>
        </header>
        <main style={{ margin: '2rem auto', maxWidth: 1200 }}>{children}</main>
        <footer style={{ padding: '1rem', background: '#f5f5f5', textAlign: 'center' }}>
            © {new Date().getFullYear()} Gestion des écoles primaires
        </footer>
    </div>
);

export default Layout;
