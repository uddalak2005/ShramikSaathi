import { Outlet, Link, useNavigate } from "react-router-dom";
import { User2, Globe, HamburgerIcon, Menu, User } from "lucide-react";
import { HandFistIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Layout = () => {

    const {isLoggedIn, userName, role, logout} = useAuth();
    const isAuthenticated = isLoggedIn;
    // const [isDummyAuthenticated, setIsDummyAuthenticated] = useState(true);
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isMenu, setIsMenu] = useState(false);

    const Name = userName || 'Souherdya';
    const userRole = role || 'Worker';

    const navigate = useNavigate();

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen max-w-[100vw] bg-background">
            {/* Navigation Header */}
            <header className="bg-card border-b border-secondary shadow-sm">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary-foreground rounded-lg flex items-center justify-center"
                            style={{
                                backgroundImage: "url('/src/assets/logo.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}>
                        </div>
                        <div>
                            <Link to="/">
                                <h1 className="text-xl font-bold text-foreground">ShramikSaathi</h1>
                                <p className="text-xs text-muted-foreground">Connecting Communities</p>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    {!isMobile ? (
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center text-muted-foreground 
                            hover:text-foreground text-sm px-3 py-1 rounded">
                                <Globe className="h-4 w-4 mr-1" />
                                English
                            </button>

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium
                                        text-foreground">{Name}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="text-sm px-6 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm px-6 py-2 border border-border rounded hover:bg-muted"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-sm px-6 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsMenu(!isMenu)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="w-6 h-6"/>
                        </button>
                    )}
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobile && isMenu && (
                <div className="flex flex-col w-full bg-card border-b border-border 
                transition-all duration-200 ease-in-out">
                    {isAuthenticated ? (
                        <>
                            <div className="flex flex-col items-center justify-center py-4 border-b 
                            border-border">
                                <span className="text-foreground font-medium">{Name}</span>
                                <span className="text-sm text-muted-foreground 
                                capitalize">{userRole}</span>
                            </div>
                            <div 
                                className="flex items-center justify-center text-destructive hover:text-destructive-foreground text-md py-4 hover:bg-destructive cursor-pointer"
                                onClick={() => {
                                    logout();
                                    setIsMenu(false);
                                }}
                            >
                                <User className="w-4 h-4 mr-4"/>
                                Logout
                            </div>
                        </>
                    ) : (
                        <>
                            <div 
                                className="flex items-center justify-center text-muted-foreground
                                hover:text-foreground text-md py-4 hover:bg-muted cursor-pointer"
                                onClick={() => {
                                    navigate("/login");
                                    setIsMenu(false);
                                }}
                            >
                                <User className="w-4 h-4 mr-4"/>
                                Login                
                            </div>
                            <div 
                                className="flex items-center justify-center text-muted-foreground hover:text-foreground text-md py-4 hover:bg-muted cursor-pointer"
                                onClick={() => {
                                    navigate("/register");
                                    setIsMenu(false);
                                }}
                            >
                                <User className="w-4 h-4 mr-4"/>
                                Register                
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t mt-20">
                <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">WorkBridge</h3>
                        <p className="text-sm text-gray-500">
                            Empowering migrant workers with opportunities, support, and community connections.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">Quick Links</h4>
                        <div className="space-y-2 text-sm text-gray-500">
                            <Link to="/jobs" className="block hover:text-gray-800">Find Jobs</Link>
                            <Link to="/legal" className="block hover:text-gray-800">Legal Support</Link>
                            <Link to="/community" className="block hover:text-gray-800">Community Forum</Link>
                            <Link to="/loans" className="block hover:text-gray-800">Financial Services</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">Support</h4>
                        <div className="space-y-2 text-sm text-gray-500">
                            <p>Help Center</p>
                            <p>Contact Us</p>
                            <p>Emergency Helpline</p>
                            <p>Language Support</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
