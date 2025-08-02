/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { User, Lock } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const validUser = users.find(
      (user: any) => user.username === username && user.password === password
    );

    if (validUser) {
      localStorage.setItem("user", JSON.stringify(validUser));
      navigate("/");
    } else {
      alert("Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex justify-center items-center px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white/90 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700">
            Welcome Back!
          </CardTitle>
          <p className="text-gray-500 mt-1 text-sm">
            Login to continue booking appointments
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => alert("Password recovery flow coming soon!")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-lg py-6 rounded-xl"
            >
              Login
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Create Account */}
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Create one
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
