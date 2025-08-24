import { useState } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Star,
  Upload,
  Camera,
  FileText,
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Edit,
  Plus
} from "lucide-react";

const Profile = () => {
  const [profileCompletion, setProfileCompletion] = useState(75);

  const profile = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    currentLocation: "Mumbai, Maharashtra",
    preferredLocations: ["Mumbai", "Pune", "Nashik"],
    currentRole: "Construction Helper",
    experience: "2 years",
    skills: ["Construction Work", "Heavy Lifting", "Site Safety", "Team Work"],
    languages: ["Hindi", "English", "Marathi"],
    documents: [
      { name: "Aadhar Card", status: "verified", uploadDate: "2024-12-15" },
      { name: "Pan Card", status: "pending", uploadDate: "2024-12-20" },
      { name: "Photo", status: "verified", uploadDate: "2024-12-10" }
    ],
    workHistory: [
      {
        company: "Metro Construction",
        role: "Construction Helper",
        duration: "Jan 2023 - Present",
        location: "Mumbai",
        description: "Working on residential construction projects"
      },
      {
        company: "BuildRight Contractors",
        role: "Site Assistant",
        duration: "Mar 2022 - Dec 2022",
        location: "Pune",
        description: "Assisted in commercial building construction"
      }
    ]
  };

  const suggestedJobs = [
    {
      id: "101",
      title: "Senior Construction Helper",
      employer: "Urban Builders Pvt Ltd",
      location: "Bandra, Mumbai",
      salary: "₹18,000-22,000/month",
      type: "Full-time",
      postedTime: "1 hour ago",
      description:
        "Looking for experienced construction helper with 2+ years experience for premium residential project.",
      matchPercentage: 95
    },
    {
      id: "102",
      title: "Site Supervisor Trainee",
      employer: "Excellence Construction",
      location: "Andheri, Mumbai",
      salary: "₹25,000-28,000/month",
      type: "Full-time",
      postedTime: "3 hours ago",
      description:
        "Opportunity for career growth - training provided for site supervision role.",
      matchPercentage: 88
    },
    {
      id: "103",
      title: "Construction Worker",
      employer: "Metro Infrastructure",
      location: "Thane, Mumbai",
      salary: "₹16,000-19,000/month",
      type: "Full-time",
      postedTime: "5 hours ago",
      description:
        "Join our team for ongoing metro construction project. Good growth opportunities.",
      matchPercentage: 82
    }
  ];

  const completionTasks = [
    { task: "Add Profile Photo", completed: true, points: 15 },
    { task: "Complete Basic Information", completed: true, points: 20 },
    { task: "Add Skills & Experience", completed: true, points: 20 },
    { task: "Upload Identity Documents", completed: false, points: 20 },
    { task: "Add Work History", completed: true, points: 15 },
    { task: "Set Location Preferences", completed: false, points: 10 }
  ];

  return (
    <div className="min-h-screen bg-primary/20">
      {/* Header */}
      <div className="bg-foreground/80">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center shadow-medium">
                  <User className="h-10 w-10 text-secondary" />
                </div>
                <button className="absolute -bottom-2 -right-2 rounded-full 
                w-8 h-8 p-0 bg-secondary hover:bg-secondary-dark flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-primary">
                  {profile.name}
                </h1>
                <p className="text-primary">
                  {profile.currentRole} • {profile.experience} experience
                </p>
                <div className="flex items-center mt-2 text-primary/60">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.currentLocation}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="border border-secondary text-secondary
              hover:bg-primary-foreground hover:text-primary px-4 py-2 rounded-lg flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button className="bg-secondary hover:bg-secondary-dark text-secondary-foreground px-4 py-2 rounded-lg flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Strength */}
            <div className="rounded-lg bg-white shadow-sm p-8">
              <h3 className="flex items-center font-semibold text-lg mb-4">
                <Award className="h-5 w-5 mr-2" />
                Profile Strength: {profileCompletion}%
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Complete your profile to get better job matches and increase
                visibility to employers.
              </p>
              <div className="space-y-3">
                {completionTasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-muted rounded-full mr-3"></div>
                      )}
                      <span
                        className={`${
                          task.completed
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.task}
                      </span>
                    </div>
                    <span className="border px-2 py-1 rounded text-xs">
                      +{task.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-4">
              <h3 className="font-semibold text-lg mb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={profile.name}
                  readOnly
                  className="bg-gray-100 p-2 rounded"
                />
                <input
                  value={profile.phone}
                  readOnly
                  className="bg-gray-100 p-2 rounded"
                />
                <input
                  value={profile.email}
                  readOnly
                  className="bg-gray-100 p-2 rounded"
                />
                <input
                  value={profile.currentLocation}
                  readOnly
                  className="bg-gray-100 p-2 rounded"
                />
              </div>
              <div>
                <p className="font-medium">Preferred Work Locations</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.preferredLocations.map((loc, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded text-xs bg-gray-100"
                    >
                      {loc}
                    </span>
                  ))}
                  <button className="border px-2 py-1 text-xs rounded flex items-center">
                    <Plus className="h-3 w-3 mr-1" /> Add Location
                  </button>
                </div>
              </div>
              <div>
                <p className="font-medium">Languages</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded text-xs bg-primary/50 text-secondary-foreground"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills & Work History, Docs, etc... */}
            {/* 👆 Same structure as above — just divs, inputs, buttons with Tailwind classes */}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Suggested Jobs */}
            <div className=" rounded-lg bg-white shadow-sm p-6">
              <h3 className="flex items-center font-semibold text-lg mb-4">
                <Star className="h-5 w-5 mr-2" /> Your past jobs
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your prior jobs and ratings
              </p>
              {suggestedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-muted/20 rounded-lg p-4 mb-3 hover:bg-muted/20 cursor-pointer"
                >
                <div className="flex gap-4">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mb-2 inline-block">
                    {job.matchPercentage}% Match
                  </span>

                  <span className="bg-foreground text-yellow-100 text-xs px-2 py-1 rounded mb-2 inline-block">
                    4 Star rating
                  </span>
                </div>
                  <h4 className="font-medium text-sm">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.employer}</p>
                  <div className="flex justify-between text-xs text-muted-foreground my-2">
                    <span>{job.location}</span>
                    <span className="font-medium">{job.salary}</span>
                  </div>
                  <button className="w-full bg-secondary text-white py-1 rounded text-sm">
                    View Details
                  </button>
                </div>
              ))}
              <button className="border bg-foreground text-white w-full py-2 rounded mt-3">
                View All Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
