import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatters";

const CertificateCard = ({ certificate, isStudentView = false }) => {
  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-[#1E293B]/40 shadow-sm space-y-4 hover:border-[#60A5FA]/50 transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#3B82F6]/20 text-[#60A5FA] text-[11px] font-mono font-semibold border border-[#60A5FA]/30">
            {certificate.status === "REVOKED" ? "REVOKED" : "ON-CHAIN CONFIRMED"}
          </span>
          <h3 className="text-lg font-bold text-[#F1F5F9] mt-2 group-hover:text-[#22D3EE] transition-colors">
            {certificate.course}
          </h3>
          <p className="text-xs text-[#94A3B8] font-medium">{certificate.institution}</p>
        </div>
        <span className="material-symbols-outlined text-[#60A5FA] text-3xl">workspace_premium</span>
      </div>

      <div className="space-y-1.5 text-xs text-[#94A3B8]">
        <div className="flex justify-between border-b border-[#1E293B]/20 pb-1">
          <span>Student Recipient:</span>
          <span className="text-[#F1F5F9] font-semibold">{certificate.studentName}</span>
        </div>
        <div className="flex justify-between border-b border-[#1E293B]/20 pb-1">
          <span>Issue Date:</span>
          <span className="font-mono text-[#F1F5F9]">{formatDate(certificate.issueDate)}</span>
        </div>
        {certificate.documentHash && (
          <div className="flex justify-between pt-0.5 font-mono">
            <span>PDF SHA-256:</span>
            <span className="text-[#60A5FA] truncate max-w-[140px]">{certificate.documentHash}</span>
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-[#1E293B]/30">
        <Link
          to={`/certificates/${certificate._id}`}
          className="text-xs font-semibold text-[#60A5FA] hover:underline flex items-center gap-1"
        >
          <span>View Details & Download PDF</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default CertificateCard;
