import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Lock, Globe, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { auth, login, validateToken } = useAuth();
  const [loginMethod, setLoginMethod] = useState("phone");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async() => {
    try{
      const res = await login(loginForm);
      
      if(res.success){
        navigate("/dashboard");
      }
  } 
    catch(err){ 
      console.error(err);
  } 
}

  // useEffect(()=>{
  //   const token = localStorage.getItem('authToken');
  //   if (token){
  //     const val = validateToken(token);
  //     console.log("Token validated");
  //     if(val){
  //       navigate('/dashboard');
  //     }
  //   }
  // },[])


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="shadow-lg border-0 rounded-2xl bg-white p-6">
          <div className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access your account and continue your journey
            </p>
          </div>

          <div className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex space-x-2 bg-muted rounded-lg p-1">
              <button
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium ${
                  loginMethod === "phone"
                    ? "bg-primary text-white"
                    : "bg-transparent text-foreground hover:bg-gray-100"
                }`}
                onClick={() => setLoginMethod("phone")}
              >
                <Phone className="h-4 w-4 mr-2" /> Phone
              </button>
              <button
                className={`flex-1 flex items-center justify-center px-3 py-2 
                rounded-md text-sm font-medium ${
                  loginMethod === "email"
                    ? "bg-primary text-white"
                    : "bg-transparent text-foreground hover:bg-gray-100"
                }`}
                onClick={() => setLoginMethod("email")}
              >
                <Mail className="h-4 w-4 mr-2" /> Email
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={loginMethod} className="block text-sm font-medium">
                  {loginMethod === "phone" ? "Phone Number" : "Email Address"}
                </label>
                <input
                  id={loginMethod}
                  type={loginMethod === "phone" ? "tel" : "email"}
                  placeholder={
                    loginMethod === "phone" ? "+91 98765 43210" : "your@email.com"
                  }
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  value={loginForm.email}
                  className="h-12 w-full px-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  className="h-12 w-full px-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                onClick={(e) => { e.preventDefault(); handleLogin(); }}
                className="w-full h-12 bg-secondary text-white rounded-lg 
                 text-lg font-semibold hover:opacity-90"
              >
                Sign In
              </button>
            </form>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" /> Preferred Language
              </label>
              <select className="w-full h-12 px-3 border rounded-lg focus:ring-2 focus:ring-primary">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Trusted by over 15,000 workers</p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <span>✓ Secure Platform</span>
            <span>✓ Verified Employers</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
