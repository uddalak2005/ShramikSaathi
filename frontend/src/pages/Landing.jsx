import { Link } from "react-router-dom";
import { Users, Shield, Heart, ArrowRight, Briefcase, Scale, CreditCard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
// import heroImage from "@/assets/hero-workers.jpg";

const Landing = () => {

  const [ismobile,setisMobile] = useState(window.innerWidth<768);
  const {login,logout,auth} = useAuth();
  const userName = auth?.userName || 'Souherdya';
  const userRole = auth?.role || 'Worker';
  const features = [
    {
      icon: Briefcase,
      title: "Find Work Easily",
      description: "Connect with verified employers and discover job opportunities that match your skills and location preferences."
    },
    {
      icon: Shield,
      title: "Get Legal & Financial Support",
      description: "Access legal advice, financial services, and micro-loans to secure your future and protect your rights."
    },
    {
      icon: Heart,
      title: "Connect with Your Community",
      description: "Join a supportive network of fellow workers, share experiences, and help each other succeed."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-[100vw] py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-90"
        style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/src/assets/hero-crop.jpg')", 
        backgroundSize: "cover", 
        backgroundPosition: "center"}}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="text-left max-w-[70vw] lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-secondary mt-6 mb-6 leading-[1.5]">
                Helping Migrant Workers Find{" "}
                <span className="text-white leading-[1.5]">Jobs, Support & Community</span>
              </h1>
              
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 
              mt-12 justify-center lg:justify-start">
                <Link to="/register">
                  <button className="flex items-center justify-center bg-secondary 
                  hover:bg-secondary-dark text-secondary-foreground font-semibold px-8 py-4 text-lg rounded-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>

                <Link to="/login">
                  <button className="flex items-center bg-secondary-foreground justify-center 
                  text-primary font-semibold hover:bg-secondary-foreground/70 hover:text-primary 
                  px-8 py-4 text-lg rounded-lg">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive support to help you find work, protect your rights, and build lasting connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-xl border 
                border-gray-200 p-8 hover:shadow-md transition-all 
                duration-300 group bg-white hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 
                rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Services at Your Fingertips
            </h2>
            <p className="text-xl text-muted-foreground">
              Access everything you need from one secure platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, label: "Job Search", color: "bg-primary" },
              { icon: Users, label: "Community", color: "bg-secondary" },
              { icon: Scale, label: "Legal Help", color: "bg-green-600" },
              { icon: CreditCard, label: "Micro Loans", color: "bg-pink-500" }
            ].map((service, index) => (
              <div key={index} className="text-center cursor-pointer">
                <div className={`w-20 h-20 bg-primary-foreground rounded-2xl flex 
                  items-center justify-center mx-auto mb-4 hover:scale-110 
                  transition-transform duration-300 shadow-md`}>
                  <service.icon className="h-10 w-10 text-secondary"/>
                </div>
                <p className="font-medium text-foreground hover:text-primary transition-colors">
                  {service.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container flex flex-col items-center justify-center gap-4 x-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of workers who have found success through our platform. Your journey to better opportunities starts here.
          </p>
          
          <Link to="/register">
            <button className="flex items-center justify-center 
            bg-secondary hover:bg-secondary-dark text-secondary-foreground 
            font-semibold px-12 py-4 text-xl rounded-lg">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-6 w-6" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
