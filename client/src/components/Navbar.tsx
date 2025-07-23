import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/user', label: 'User' },
  { path: '/settings', label: 'Settings' }
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav style={{
      background: '#222',
      color: '#fff',
      padding: '1rem',
      display: 'flex',
      gap: '2rem'
    }}>
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            color: '#fff',
            textDecoration: location.pathname === item.path ? 'underline' : 'none'
          }}
          aria-current={location.pathname === item.path ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}