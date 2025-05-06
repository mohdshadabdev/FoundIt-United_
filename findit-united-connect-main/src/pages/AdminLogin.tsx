
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implement Supabase admin login here when connected
      // For now, simulate login for admin@united.edu
      if (email === "admin@united.edu" && password === "admin123") {
        // Store admin information in localStorage
        localStorage.setItem("admin", JSON.stringify({ email, role: "admin" }));
        // Also set in user localStorage to ensure admin access is recognized by Navbar
        localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
        
        setTimeout(() => {
          toast({
            title: "Admin login successful!",
            description: "Welcome to the admin dashboard.",
            variant: "default",
          });
          navigate("/admin");
        }, 1000);
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error) {
      toast({
        title: "Admin login failed",
        description: "Invalid administrator credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white animate-fade-in">
            Administrator Login
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 animate-fade-in animate-delay-100">
            Sign in to access the admin dashboard
          </p>
        </div>

        <Card className="animate-fade-in animate-delay-200 border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-orange-50 dark:bg-orange-900/20 rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <ShieldAlert className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>
              This area is restricted to authorized personnel only
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@united.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full bg-orange-600 hover:bg-orange-700" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in as Administrator"}
              </Button>
              <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                Not an administrator?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Go to student login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
