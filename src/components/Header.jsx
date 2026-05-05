// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "Doctors", path: "#doctors" },
    { name: "News", path: "#news" },
    { name: "Contact", path: "#contact" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-teal-700 shadow-lg">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-teal-700 font-bold text-xl leading-none">H</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">HealthCenter</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
  <a
    key={link.name}
    href={link.path}
    className="text-white/85 hover:text-white text-base font-medium transition-colors duration-200"
  >
    {link.name}
  </a>
))}

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/40"}
                  alt="user"
                  className="w-8 h-8 rounded-full ring-2 ring-white/30"
                />
                <span className="text-white text-sm font-medium">
                  {user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-white text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 bg-white text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-colors duration-200 ml-2"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl leading-none p-1"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 border-t border-white/20 mt-1 pt-3">
            {navLinks.map((link) => (
  <a
    key={link.name}
    href={link.path}
    onClick={() => setIsOpen(false)}
    className="text-white/90 hover:text-white py-2 px-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors"
  >
    {link.name}
  </a>
))}
            {user ? (
              <button onClick={handleLogout} className="text-white/90 py-2 px-2 text-left text-sm font-medium">
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-white/90 py-2 px-2 text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;