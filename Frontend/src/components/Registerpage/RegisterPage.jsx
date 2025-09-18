import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router';
import { Navigate } from 'react-router';
import Cookies from "js-cookie"
export default function RegisterPage() {
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  
  const handleRegister = async () => {
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';

    if (username && username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    
    if (email && !email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        
        setErrors({ general: data.message || "Something went wrong" });
      } else {
        alert("Registration successful!");
      
        <Navigate to="/login"/>
      }
    } catch (error) {
      setErrors({ general: "Server error. Please try again later." },error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  if(Cookies.get("jwt_token")!==undefined){
      return <Navigate to="/" replace={true}/>
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-800 flex items-center justify-center p-4">
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl relative">
        
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70">Join us today</p>
        </div>

        
        <div className="mb-4">
          <label className="block text-white/90 text-sm font-medium mb-2">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError('username');
              }}
              className={`w-full pl-12 pr-4 py-3 bg-white/10 border ${
                errors.username ? 'border-red-400' : 'border-white/20'
              } rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400`}
              placeholder="Choose a username"
            />
          </div>
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        
        <div className="mb-4">
          <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              className={`w-full pl-12 pr-4 py-3 bg-white/10 border ${
                errors.email ? 'border-red-400' : 'border-white/20'
              } rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        
        <div className="mb-4">
          <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError('password');
              }}
              className={`w-full pl-12 pr-12 py-3 bg-white/10 border ${
                errors.password ? 'border-red-400' : 'border-white/20'
              } rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400`}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

       
        <div className="mb-4">
          <label className="block text-white/90 text-sm font-medium mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError('confirmPassword');
              }}
              className={`w-full pl-12 pr-12 py-3 bg-white/10 border ${
                errors.confirmPassword ? 'border-red-400' : 'border-white/20'
              } rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        
        {errors.general && (
          <p className="text-red-400 text-sm mt-2 text-center">{errors.general}</p>
        )}

       
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mt-6"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </button>

       
        <div className="text-center mt-6">
          <span className="text-white/70 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-green-300 hover:text-green-200 font-medium">Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
