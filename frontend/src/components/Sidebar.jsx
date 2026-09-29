import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || "Student";

  const allLinks = [
    { name: "Dashboard Overview", path: "/dashboard", icon: "dashboard", roles: ["Admin"] },
    { name: "Issue New Certificate", path: "/issue", icon: "add_circle", roles: ["Admin"] },
    { name: userRole === "Student" ? "My Locker" : "All Certificates", path: "/certificates", icon: "award", roles: ["Admin", "Student"] },
    { name: "Verify Certificate", path: "/verify", icon: "search", roles: ["Admin"] },
  ];

  const filteredLinks = allLinks.filter((link) => link.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1E293B]/40 p-6 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-64px)]">
      <div className="space-y-6">
        <div className="p-3 bg-[#080D16] border border-[#1E293B]/40 rounded-xl">
          <div className="flex items-center gap-2 text-[#60A5FA] font-semibold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>Portal Role</span>
          </div>
          <p className="text-sm font-bold text-[#F1F5F9] mt-1">{userRole}</p>
          {user?.institution && <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{user.institution}</p>}
        </div>

        <nav className="space-y-1.5 font-medium text-sm">
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#3B82F6]/20 text-[#60A5FA] border border-[#60A5FA]/40 shadow-md font-semibold"
                    : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111827]"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 rounded-xl bg-[#080D16] border border-[#1E293B]/40 text-xs text-[#94A3B8]">
        <p className="font-semibold text-[#F1F5F9]">Ethereum Network</p>
        <p className="text-[11px] text-[#60A5FA] font-mono mt-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse"></span>
          Connected (Sepolia Testnet)
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
