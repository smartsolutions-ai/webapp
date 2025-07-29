import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <header>
                <h1>AI Solutions Landing Page</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; {new Date().getFullYear()} AI Solutions. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;