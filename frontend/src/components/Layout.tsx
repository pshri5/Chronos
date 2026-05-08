import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Job Management Platform</h1>
        <nav>
          {/* Navigation links will be added here */}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Job Management Platform</p>
      </footer>
    </div>
  );
};

export default Layout;