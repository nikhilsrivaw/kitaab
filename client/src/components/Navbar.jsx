import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-[var(--color-charcoal)] border-b border-[var(--color-warm-gray)]/20">
            <div className="container mx-auto px-8 py-5 flex justify-between items-center">
                <div className="flex items-center space-x-12">
                    <Link to="/" className="font-serif text-3xl font-semibold text-[var(--color-cream)] tracking-tight
  hover:text-[var(--color-terracotta)] transition-colors duration-300">
                        Kitaab
                    </Link>
                    <Link to="/projects" className="text-[var(--color-warm-gray)] hover:text-[var(--color-cream)] transition-colors
  duration-200 font-medium">
                        Projects
                    </Link>
                    <Link to="/clients" className="text-[var(--color-warm-gray)] hover:text-[var(--color-cream)] transition-colors duration-200 font-medium">
                        Clients
                    </Link>
                </div>

                <div className="flex items-center space-x-8">
                    <span className="text-[var(--color-warm-gray)]">
                        Welcome, <span className="text-[var(--color-cream)] font-medium">{user?.name}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 bg-transparent border border-[var(--color-warm-gray)]/40 text-[var(--color-cream)] rounded        
  hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)] transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;