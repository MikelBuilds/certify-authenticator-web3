import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerAuth, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await registerAuth({
      ...data,
      role: "Admin",
    });

    if (res.success) {
      toast.success("Institution registration successful!");
      navigate("/dashboard");
    } else {
      toast.error(res.message || "Registration failed");
    }
  };

  return (
    <div className="bg-[#080D16] text-[#F1F5F9] font-['Inter',sans-serif] min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl p-8 border border-[#1E293B]/40 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 border border-[#60A5FA]/40 text-[#60A5FA] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F1F5F9]">Register Institution Admin</h2>
          <p className="text-xs text-[#94A3B8]">Create an administrator account for credential issuance</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F1F5F9] mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Dr. Alexander Wright"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#080D16] border border-[#1E293B]/60 text-[#F1F5F9] text-sm focus:border-[#60A5FA] focus:outline-none"
            />
            {errors.name && <span className="text-xs text-[#ffb4ab] mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F1F5F9] mb-1">Institution Name</label>
            <input
              type="text"
              placeholder="Stanford Institute of Technology"
              {...register("institution", { required: "Institution name is required" })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#080D16] border border-[#1E293B]/60 text-[#F1F5F9] text-sm focus:border-[#60A5FA] focus:outline-none"
            />
            {errors.institution && <span className="text-xs text-[#ffb4ab] mt-1 block">{errors.institution.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F1F5F9] mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@stanford.edu"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#080D16] border border-[#1E293B]/60 text-[#F1F5F9] text-sm focus:border-[#60A5FA] focus:outline-none font-mono"
            />
            {errors.email && <span className="text-xs text-[#ffb4ab] mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F1F5F9] mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#080D16] border border-[#1E293B]/60 text-[#F1F5F9] text-sm focus:border-[#60A5FA] focus:outline-none font-mono"
            />
            {errors.password && <span className="text-xs text-[#ffb4ab] mt-1 block">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F1F5F9] mb-1">Admin Invitation Code</label>
            <input
              type="password"
              autoComplete="off"
              placeholder="Code provided by the project owner"
              {...register("adminRegistrationCode")}
              className="w-full px-4 py-2.5 rounded-lg bg-[#080D16] border border-[#1E293B]/60 text-[#F1F5F9] text-sm focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 btn-shine cursor-pointer"
          >
            <span>{loading ? "Registering..." : "Create Admin Account"}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="text-center text-xs text-[#94A3B8] pt-2 border-t border-[#1E293B]/30">
          Already registered?{" "}
          <Link to="/login" className="text-[#60A5FA] hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
