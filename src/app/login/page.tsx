'use client'
// login-page.tsx
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface User {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true when login button is clicked

    try {
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      window.location.replace("/");
    } catch (error: any) {
      console.log("Login failed", error.message);
      setError("Login failed. Please check your credentials."); // Set the error message
      toast.error(error.message);
    } finally {
      setLoading(false); // Reset loading state after login attempt
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
      <div className="border rounded-2xl sm:p-30 lg:px-40 md:p-20">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
          {/* Left half with welcoming message and quote */}
          <div className="md:w-1/2 rounded-2xl bg-gray-800 p-8">
            {/* Logo and website name */}
            <div className="flex items-center justify-center mb-8">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-2" /> 
              <h1 className="text-2xl font-semibold">EVOLVE</h1>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Welcome back!</h2>
            <p className="text-lg text-center md:text-left">Your journey to success starts with a single step.</p>
          </div>
          {/* Right half with login form */}
          <div className="md:w-1/2 rounded-2xl bg-gray-900 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
            <form className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="text-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  placeholder="Enter the email"
                  autoComplete='current-email'
                />
              </div>
              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  id="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className="text-gray-900 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  placeholder="Enter the password"
                  autoComplete='current-password'
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>} 
              <button
                onClick={onLogin}
                className="w-full py-2 px-4 bg-blue-600 cursor-pointer text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                disabled={buttonDisabled || loading} 
              >
                {loading ? "..." : "Login"} 
              </button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-300">Don't have an account? <Link href="/signup" className="text-blue-400 hover:underline">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}
