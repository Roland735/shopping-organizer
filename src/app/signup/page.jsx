"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setErrorMsg(data.error || "Signup failed");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 to-yellow-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transition-all duration-300 hover:shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500">Join our community </p>
        </div>

        {errorMsg && (
          <div className="flex items-center p-3 bg-red-100 rounded-lg">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <span className="text-red-600 text-sm">{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex items-center border rounded-lg px-4 py-3 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="John Doe"
                className="flex-1 outline-none bg-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border rounded-lg px-4 py-3 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="john@example.com"
                className="flex-1 outline-none bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-4 py-3 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                className="flex-1 outline-none bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign Up</span>
              <FaArrowRight className="ml-2" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-orange-600 hover:underline font-medium"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
