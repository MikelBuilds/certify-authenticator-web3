import React from "react";

const LoadingSpinner = ({ label = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <div className="w-10 h-10 border-4 border-[#1E293B] border-t-[#60A5FA] rounded-full animate-spin"></div>
      <p className="text-xs font-mono text-[#94A3B8] animate-pulse">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
