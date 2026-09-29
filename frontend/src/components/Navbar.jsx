import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { shortenAddress } from "../utils/formatters";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
    }
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask extension not found in your browser! Please install MetaMask.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.success(`MetaMask Connected: ${shortenAddress(accounts[0])}`);
      }
    } catch (err) {
      console.error("MetaMask connection error:", err);
      toast.error("Failed to connect MetaMask wallet");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleStudentLockerClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast("Please sign in as a Student to access your Student Locker.", { icon: "🔒" });
      navigate("/login");
    } else {
      navigate("/certificates");
    }
  };

  const isStudent = user?.role === "Student";

  return (
    <header className="sticky top-0 z-50 bg-[#080D16]/90 backdrop-blur-md border-b border-[#1E293B]/30 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between h-16">
        {/* Brand Logo Anchor */}
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, "hero-section")}
          className="text-lg font-semibold tracking-tight text-[#F1F5F9] flex items-center gap-2 active:scale-[0.98] transition-transform group"
        >
          <span className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1E293B]/50 flex items-center justify-center text-[#60A5FA] group-hover:border-[#60A5FA]/60 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all">
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">verified_user</span>
          </span>
          <span className="tracking-wide font-bold">CertiFy</span>
        </Link>

        {/* Section Scroll Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, "how-it-works")}
            className="text-[#94A3B8] hover:text-[#60A5FA] transition-colors duration-150 py-1 hover:border-b-2 hover:border-[#60A5FA]"
          >
            How It Works
          </a>

          <a
            href="#verify"
            onClick={(e) => handleNavClick(e, "verify")}
            className="text-[#94A3B8] hover:text-[#60A5FA] transition-colors duration-150 py-1 hover:border-b-2 hover:border-[#60A5FA]"
          >
            Verify
          </a>

          <a
            href="#student-locker"
            onClick={handleStudentLockerClick}
            className="text-[#94A3B8] hover:text-[#60A5FA] transition-colors duration-150 py-1 hover:border-b-2 hover:border-[#60A5FA]"
          >
            Student Locker
          </a>

          <a
            href="#why-blockchain"
            onClick={(e) => handleNavClick(e, "why-blockchain")}
            className="text-[#94A3B8] hover:text-[#60A5FA] transition-colors duration-150 py-1 hover:border-b-2 hover:border-[#60A5FA]"
          >
            Why Blockchain
          </a>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-3">
          {/* MetaMask Button */}
          <button
            onClick={connectMetaMask}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
              walletAddress
                ? "bg-[#3B82F6]/10 text-[#60A5FA] border-[#60A5FA]/40"
                : "bg-[#111827] text-[#94A3B8] hover:border-[#60A5FA]/60 hover:text-[#60A5FA] border-[#1E293B]/60"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">wallet</span>
            <span>{walletAddress ? shortenAddress(walletAddress, 4) : "MetaMask"}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* ADMIN CONTROLS: Dashboard & Issue Certificate */}
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111827] text-[#F1F5F9] border border-[#1E293B]/60 hover:border-[#60A5FA]/60 hover:text-[#60A5FA] text-xs font-medium transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">dashboard</span>
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>

                  <Link
                    to="/issue"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#60A5FA] text-xs font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>Issue Certificate</span>
                  </Link>
                </div>
              )}

              {/* STUDENT CONTROLS: Student Locker */}
              {isStudent && (
                <Link
                  to="/certificates"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6]/20 text-[#60A5FA] border border-[#60A5FA]/40 text-xs font-semibold transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>My Locker</span>
                </Link>
              )}

              <div className="hidden sm:flex flex-col text-right border-l border-[#1E293B]/40 pl-3">
                <span className="text-xs font-semibold text-[#F1F5F9]">{user?.name}</span>
                <span className="text-[10px] text-[#60A5FA] font-mono font-medium">{user?.role}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/40 text-xs font-medium transition-all active:scale-95 flex items-center gap-1"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold bg-[#111827] text-[#F1F5F9] border border-[#1E293B]/60 rounded-lg hover:border-[#60A5FA]/60 hover:text-[#60A5FA] hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200 flex items-center gap-1.5 active:scale-95 btn-shine"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
