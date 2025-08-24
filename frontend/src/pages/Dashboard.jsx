import React from "react";
import {
  Briefcase,
  Users,
  User,
  Scale,
  CreditCard,
  Bell,
  Search,
  MapPin,
  Calendar,
  TrendingUp,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {login,logout,auth} = useAuth();
    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  const mainServices = [
    {
      title: "Job Applications & Updates",
      description: "Track your applications and discover new opportunities",
      icon: Briefcase,
      actionText: "View Jobs",
      bgGradient: "bg-gradient-to-r from-blue-500 to-blue-400",
      notifications: 2,
      to:'/jobs'
    },
    {
      title: "Community Forum",
      description: "Connect with fellow workers and share experiences",
      icon: Users,
      actionText: "Join Discussion",
      bgGradient: "bg-gradient-to-r from-purple-500 to-purple-400",
      notifications: 5,
      to:'/community'
    },
    {
      title: "Skill Matching & Profile",
      description: "Optimize your profile and get matched with suitable jobs",
      icon: User,
      actionText: "Update Profile",
      bgGradient: "bg-gradient-to-r from-green-500 to-green-400",
      notifications: 0,
      to:'/jobs'
    },
    {
      title: "Legal Support",
      description: "Get legal advice and know your rights as a worker",
      icon: Scale,
      actionText: "Get Help",
      bgGradient: "bg-gradient-to-r from-orange-500 to-orange-400",
      notifications: 1,
      to:'/legal'
    },
    {
      title: "Micro Loan Marketplace",
      description: "Access financial services and micro-loans safely",
      icon: CreditCard,
      actionText: "Explore Options",
      bgGradient: "bg-gradient-to-r from-red-500 to-red-400",
      notifications: 0,
      to:'/loans'
    },
    {
      title: "Shramik saathi",
      description: "Ask questions, get help, just the way you want",
      icon: CreditCard,
      actionText: "Talk with Shramik Saathi",
      bgGradient: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      notifications: 0,
      to:'/rag'
    },
  ];

  const recentActivity = [
    {
      type: "application",
      title: "Application submitted for Construction Helper",
      location: "Mumbai, Maharashtra",
      time: "2 hours ago",
      status: "pending",
    },
    {
      type: "match",
      title: "New job match found",
      location: "Bangalore, Karnataka",
      time: "5 hours ago",
      status: "new",
    },
    {
      type: "community",
      title: "Someone replied to your post in Community",
      location: "General Discussion",
      time: "1 day ago",
      status: "update",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-secondary-foreground text-secondary">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Rajesh</h1>
              <p className="opacity-80 mt-1">
                Here's what's happening with your profile today
              </p>
            </div>
            <button className="flex items-center justify-center border border-white text-white rounded-full 
            py-2 px-4 hover:bg-white hover:text-secondary font-semibold transition-colors">
              <Bell className="h-4 w-4 mr-2" />
              {isMobile? "" : 'Notifications' }
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {mainServices.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => window.location.href = service.to}
            >
              <div className="flex items-start justify-between pb-3">
                <div
                  className={`w-12 h-12 ${service.bgGradient} text-white 
                  rounded-xl flex items-center justify-center 
                  transition-transform duration-300 transform hover:scale-110`}
                >
                  <service.icon className="h-6 w-6" />
                </div>
                {service.notifications > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs 
                  font-semibold rounded-full bg-red-500 
                  text-white">
                    {service.notifications}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 transition-colors hover:text-blue-600">
                {service.title}
              </h3>
              <p className="text-gray-500 mt-1">
                {service.description}
              </p>
              <button className="mt-4 w-full text-left font-medium text-blue-600 
              hover:text-blue-700 transition-colors">
                {service.actionText} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
