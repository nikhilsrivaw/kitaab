import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from
    '@/components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../components/ThemeProvider"
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { setTheme } = useTheme()

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
            <nav className="max-w-7xl mx-auto backdrop-blur-md bg-[var(--color-charcoal)]/80 border border-white/10 shadow-2xl rounded-2xl">

                <div className="px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-12">
                        <Link to="/" className="font-serif text-3xl font-bold text-[var(--color-cream)] tracking-tight
  hover:text-[var(--color-terracotta)] transition-colors duration-300">
                            Kitaab
                        </Link>
                        <Link to="/projects" className="text-[var(--color-warm-gray)] hover:text-[var(--color-cream)] transition-colors duration-200      
  font-medium">
                            Projects
                        </Link>
                        <Link to="/clients" className="text-[var(--color-warm-gray)] hover:text-[var(--color-cream)] transition-colors duration-200       
  font-medium">
                            Clients
                        </Link>
                    </div>


                    <div className="flex items-center space-x-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-[var(--color-warm-gray)] text-sm">
                            Welcome, <span className="text-[var(--color-cream)] font-medium">{user?.name}</span>
                        </span>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                                    <Avatar className="h-10 w-10 border-2 border-[var(--color-terracotta)]/50">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-forest-green)]        
  text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 backdrop-blur-md bg-[var(--color-charcoal)]/95 border border-white/10" align="end">
                                <DropdownMenuLabel className="text-[var(--color-cream)]">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="text-[var(--color-warm-gray)] hover:text-[var(--color-cream)] hover:bg-white/10
  cursor-pointer">
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[var(--color-warm-gray)] hover:text-[var(--color-cream)] hover:bg-white/10
  cursor-pointer">
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-[var(--color-terracotta)] hover:text-[var(--color-terracotta)] hover:bg-white/10 cursor-pointer       
  font-medium"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;