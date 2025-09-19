
import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate ,Navigate} from "react-router";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    if (!email || !password) {
      setErrors({ general: "Email & password required" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("https://contactapp-6siq.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.message || "Login failed" });
      } else {
        const JwtToken = data.jwt_token;
        console.log(JwtToken);
        Cookies.set("jwt_token", JwtToken, { expires: 30 });
        navigate("/");
      }
    } catch (err) {
      setErrors({ general: "Server error. Try again later." });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
    
    


  };
  if(Cookies.get("jwt_token")!==undefined){
    return <Navigate to="/" replace={true}/>
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

     
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl relative">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back
        </h1>

        <div className="relative w-full mb-4">
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-green-400"
          />
        </div>

        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full pl-4 pr-12 py-3 bg-white/10 border ${
              errors.password ? "border-red-400" : "border-white/20"
            } rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400`}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {errors.general && (
          <p className="text-red-400 text-sm mb-2">{errors.general}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 p-3 mt-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? "Logging in..." : "Login"}
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="text-green-300 hover:text-green-200 font-medium"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
