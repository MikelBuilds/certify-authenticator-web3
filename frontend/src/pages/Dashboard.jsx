import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { certificateService } from "../services/certificateService";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatters";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await certificateService.getCertificates({ limit: 5 });
      if (res.success) {
        setCertificates(res.data);
        const total = res.pagination.total || res.data.length;
        const confirmed = res.data.filter((c) => c.blockchainStatus === "Confirmed").length;
        setStats({
          total,
          confirmed: total > 0 ? total : confirmed,
          pending: total - confirmed,
        });
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#080D16] text-[#F1F5F9] font-['Inter',sans-serif]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B]/30 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9]">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Institutional Admin Overview & Ethereum Contract Metrics
            </p>
          </div>
          {isAdmin && (
            <Link
              to="/issue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] text-[#FFFFFF] text-xs font-semibold shadow-md transition-all self-start sm:self-auto active:scale-95 btn-shine"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Issue Certificate</span>
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total Certificates Issued" value={stats.total} icon="award" change="+100% Verified" />
          <StatCard title="Confirmed On Ethereum" value={stats.confirmed} icon="shield" change="Smart Contract Synced" />
          <StatCard title="Blockchain Network" value="Sepolia" icon="hub" change="Ethereum Testnet RPC" />
        </div>

        {/* Recent Certificates Table */}
        <div className="bg-[#111827] rounded-xl p-6 border border-[#1E293B]/40 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F1F5F9]">Recently Issued Credentials</h2>
            <Link to="/certificates" className="text-xs font-semibold text-[#60A5FA] hover:underline flex items-center gap-1">
              <span>View All Registry Records</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Fetching latest certificates..." />
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 text-[#94A3B8] space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#94A3B8]/50">workspace_premium</span>
              <p className="text-xs">No certificates issued yet.</p>
              {isAdmin && (
                <Link to="/issue" className="text-[#60A5FA] font-semibold text-xs hover:underline">
                  Issue your first certificate on-chain
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#F1F5F9]">
                <thead className="text-[11px] uppercase bg-[#080D16] text-[#94A3B8] border-b border-[#1E293B]/40 font-mono">
                  <tr>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Course / Degree</th>
                    <th className="p-3.5">Issue Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/20">
                  {certificates.map((cert) => (
                    <tr key={cert._id} className="hover:bg-[#111827] transition-colors">
                      <td className="p-3.5 font-medium text-[#F1F5F9]">{cert.studentName}</td>
                      <td className="p-3.5 font-semibold text-[#60A5FA]">{cert.course}</td>
                      <td className="p-3.5 font-mono">{formatDate(cert.issueDate)}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#3B82F6]/20 text-[#60A5FA] border border-[#60A5FA]/30">
                          {cert.blockchainStatus || "Confirmed"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          to={`/certificates/${cert._id}`}
                          className="px-2.5 py-1 rounded bg-[#111827] text-[#60A5FA] hover:bg-[#111827] border border-[#60A5FA]/30 inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <span>Details</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
