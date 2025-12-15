import { Link, useLocation } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { role, setRole } = useRole()
  const location = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Compliance Banking System</h1>
          <div className="header-actions">
            <div className="role-selector">
              <button
                className={`role-btn ${role === 'Maker' ? 'active' : ''}`}
                onClick={() => setRole('Maker')}
              >
                Maker
              </button>
              <button
                className={`role-btn ${role === 'Approval' ? 'active' : ''}`}
                onClick={() => setRole('Approval')}
              >
                Approval
              </button>
            </div>
          </div>
        </div>
      </header>
      <nav className="navbar">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          General List
        </Link>
        {role === 'Approval' && (
          <>
            <Link
              to="/applications"
              className={`nav-link ${
                location.pathname === '/applications' ? 'active' : ''
              }`}
            >
              Заявки
            </Link>
            <Link
              to="/transactions"
              className={`nav-link ${
                location.pathname === '/transactions' ? 'active' : ''
              }`}
            >
              Transaction Table
            </Link>
          </>
        )}
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}

