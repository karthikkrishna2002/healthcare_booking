import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"; // Assumes this button is also styled with the variables
import {
  Menu,
  X,
  User,
  HeartPulse,
  Sun,
  Moon,
  LogOut,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    // Initialize state from localStorage, default to false (light mode)
    () => localStorage.getItem("theme") === "dark"
  );
  const [subscription, setSubscription] = useState<{
    plan: string;
    active: boolean;
  } | null>(null);

  const navigate = useNavigate();

  // This effect handles applying the 'dark' class to the <html> tag on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser).username);

    const sub = localStorage.getItem("subscription");
    if (sub) setSubscription(JSON.parse(sub));
    
    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDarkMode(isDark);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
    setUser(null);
    setSubscription(null);
    setProfileOpen(false); // Close dropdown on logout
    setMenuOpen(false); // Close mobile menu on logout
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    // Cleaner background and border classes using CSS variables
    <nav className="bg-background/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo uses primary color */}
        <Link to="/" className="flex items-center gap-2 group">
          <HeartPulse className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-extrabold text-primary group-hover:text-primary/90 transition-colors">
            HealthBook
          </span>
        </Link>

        {/* Desktop Menu uses foreground and primary for hover */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-primary transition font-medium">
            Home
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition font-medium">
            About Us
          </Link>
          <Link to="/subscriptions" className="text-foreground/80 hover:text-primary transition font-medium">
            Subscriptions
          </Link>
          <Link to="/reminders" className="text-foreground/80 hover:text-primary transition font-medium">
            Medicine Reminder
          </Link>
          {user && (
            <Link to="/appointments" className="text-foreground/80 hover:text-primary transition font-medium">
              My Appointments
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-secondary transition"
            title="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? "moon" : "sun"}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-full transition"
              >
                <User className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Hi, {user}
                </span>
                {subscription?.active && (
                  <span title={`Subscribed: ${subscription.plan}`}>
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-card shadow-lg rounded-lg border border-border overflow-hidden"
                  >
                    <Link to="/appointments" className="block px-4 py-2 hover:bg-secondary text-foreground text-sm" onClick={() => setProfileOpen(false)}>
                      My Appointments
                    </Link>
                    <Link to="/reminders" className="block px-4 py-2 hover:bg-secondary text-foreground text-sm" onClick={() => setProfileOpen(false)}>
                      Medicine Reminder
                    </Link>
                    <Link to="/subscriptions" className="block px-4 py-2 hover:bg-secondary text-foreground text-sm" onClick={() => setProfileOpen(false)}>
                      Manage Subscription
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive text-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Make sure your Button component uses the new variables too!
            <Button
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-t border-border shadow-inner overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-3">
              <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-primary text-foreground py-2 rounded-md px-3">
                Home
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-primary text-foreground py-2 rounded-md px-3">
                About Us
              </Link>
              <Link to="/subscriptions" onClick={() => setMenuOpen(false)} className="hover:text-primary text-foreground py-2 rounded-md px-3">
                Subscriptions
              </Link>
              <Link to="/reminders" onClick={() => setMenuOpen(false)} className="hover:text-primary text-foreground py-2 rounded-md px-3">
                Medicine Reminder
              </Link>
              {user && (
                <Link to="/appointments" onClick={() => setMenuOpen(false)} className="hover:text-primary text-foreground py-2 rounded-md px-3">
                  My Appointments
                </Link>
              )}
              <hr className="border-border" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-destructive hover:bg-destructive/10 px-3 py-2 rounded-md"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Button onClick={() => { setMenuOpen(false); navigate("/login"); }} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  Login
                </Button>
              )}
               <button onClick={toggleDarkMode} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary mt-2">
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
                <span className="text-foreground">{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}