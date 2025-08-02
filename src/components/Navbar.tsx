import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
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
    localStorage.getItem("theme") === "dark"
  );
  const [subscription, setSubscription] = useState<{
    plan: string;
    active: boolean;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser).username);

    const sub = localStorage.getItem("subscription");
    if (sub) setSubscription(JSON.parse(sub));

    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
    setUser(null);
    setSubscription(null);
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <HeartPulse className="w-7 h-7 text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">
            HealthBook
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            About Us
          </Link>
          <Link
            to="/subscriptions"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Subscriptions
          </Link>
          <Link
            to="/reminders"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Medicine Reminder
          </Link>
          {user && (
            <Link
              to="/appointments"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
            >
              My Appointments
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition"
              >
                <User className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
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
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 overflow-hidden"
                  >
                    <Link
                      to="/appointments"
                      className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Appointments
                    </Link>
                    <Link
                      to="/reminders"
                      className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                      onClick={() => setProfileOpen(false)}
                    >
                      Medicine Reminder
                    </Link>
                    <Link
                      to="/subscriptions"
                      className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                      onClick={() => setProfileOpen(false)}
                    >
                      Manage Subscription
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-inner"
          >
            <div className="flex flex-col p-4 space-y-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
              >
                About Us
              </Link>
              <Link
                to="/subscriptions"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
              >
                Subscriptions
              </Link>
              <Link
                to="/reminders"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
              >
                Medicine Reminder
              </Link>
              {user && (
                <Link
                  to="/appointments"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
                >
                  My Appointments
                </Link>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900 px-3 py-2 rounded"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
