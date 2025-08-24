import { useState } from "react";
import { Search, Filter, SlidersHorizontal, NotebookPenIcon, Notebook } from "lucide-react";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
      // Add window resize listener
      useEffect(() => {
          const handleResize = () => {
              setIsMobile(window.innerWidth < 768);
          };
  
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
      }, []);

  useEffect(()=> {

  const fetchJobs = async() => {
    try{
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mandi/getJobs` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log(res);
      if(res.ok){
        const data = await res.json();
        console.log(data);

        setJobs(data);
        console.log("Jobs updated");
      }
    }
    catch(err){
      console.error(err);
    }
  }

  fetchJobs();
  console.log("jobs fetched!");
  },[])

  // Mock job data
  const [jobs, setJobs] = useState([
  {
    id: "68aa205642ea9acffae730b3",
    title: "Gardener",
    employer: "68a46ae278445908ff46faaa", // employerId from schema
    location: "123 Market St, San Francisco, CA",
    salary: "12,500",
    type: "20 days", // mapped from duration
    postedTime: "Just now", // you can calculate from createdAt
    description:
      "Maintain plants, water regularly, and remove weeds in small gardens.",
    skillsRequired: ["Plant Care", "Weeding"],
    suggestedWage: 40,
    offeredWage: 45,
    status: "open",
  },
]);

  const quickFilters = [
    { label: "Construction", count: 45 },
    { label: "Security", count: 32 },
    { label: "Delivery", count: 28 },
    { label: "Housekeeping", count: 23 },
    { label: "Kitchen", count: 19 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Find Your Next Job
              </h1>
              <p className="text-white/80 max-w-[50vw]">
                Discover opportunities that match your skills and location
              </p>
            </div>

            <Link
              to="/job-applications"
              className="px-4 py-2 border rounded-xl border-white
               text-white hover:bg-white hover:text-blue-600"
            >
              {isMobile ? <Notebook className="h-4 w-4 bg-white"/> : 'My Applications'}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="bg-secondary-foreground/50 rounded-2xl p-6 shadow">
            <div className="flex flex-col md:flex-row gap-4 rounded-xl">
              <div className="flex-1 relative rounded-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  placeholder="What kind of work are you looking for?"
                  className="pl-12 h-14 text-lg border rounded w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-14 px-6 rounded-xl bg-primary flex items-center"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </button>

                <button className="h-14 px-8 bg-secondary-foreground text-white rounded-xl hover:opacity-90 flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                className="h-auto py-3 px-4 border rounded flex items-center"
              >
                <span className="font-medium">{filter.label}</span>
                <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded shadow p-6">
                <h3 className="flex items-center font-bold mb-4">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                <div className="space-y-6 text-sm">
                  {/* Location */}
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <select className="w-full border rounded p-2">
                      <option>Select city</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="chennai">Chennai</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <h4 className="font-medium mb-2">Job Type</h4>
                    <select className="w-full border rounded p-2">
                      <option>Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="night-shift">Night Shift</option>
                    </select>
                  </div>

                  {/* Salary */}
                  <div>
                    <h4 className="font-medium mb-2">Salary Range</h4>
                    <select className="w-full border rounded p-2">
                      <option>Select range</option>
                      <option value="10-15">₹10,000 - ₹15,000</option>
                      <option value="15-20">₹15,000 - ₹20,000</option>
                      <option value="20-25">₹20,000 - ₹25,000</option>
                      <option value="25+">₹25,000+</option>
                    </select>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Job Listings */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Jobs
                </h2>
                <p className="text-gray-500">{jobs.length} jobs found</p>
              </div>

              <select defaultValue="recent" className="border rounded p-2">
                <option value="recent">Most Recent</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
                <option value="location">By Location</option>
              </select>
            </div>

            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard
                key={job.title}              // use _id from schema
                _id={job._id}
                title={job.title}
                employer={job.employer}  // right now schema only has employerId
                location={job.location?.address}
                salary={`₹${job.salary.toLocaleString()}/month`}
                type={job.duration}        // duration maps to type in your UI
                postedTime={new Date(job.createdAt).toLocaleDateString()} 
                description={job.description}
                status={job.status}
                skillsRequired={job.skillsRequired}
                suggestedWage={job.suggestedWage}
                offeredWage={job.offeredWage}
              />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-12 py-3 border rounded hover:bg-gray-100">
                Load More Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
