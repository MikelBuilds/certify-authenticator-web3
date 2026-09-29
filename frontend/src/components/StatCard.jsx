import React from "react";

const StatCard = ({ title, value, icon: Icon, change }) => {
  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-[#1E293B]/40 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/15 border border-[#60A5FA]/30 flex items-center justify-center text-[#60A5FA]">
          {typeof Icon === "string" ? (
            <span className="material-symbols-outlined text-xl">{Icon}</span>
          ) : (
            <Icon className="w-5 h-5 text-[#60A5FA]" />
          )}
        </div>
      </div>
      <div className="text-3xl font-bold text-[#F1F5F9] font-mono">{value}</div>
      {change && <p className="text-xs font-mono text-[#60A5FA]">{change}</p>}
    </div>
  );
};

export default StatCard;
