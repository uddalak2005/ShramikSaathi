import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PostJobDialog from "../components/postJobContent";

const PostJobs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock posted jobs data
  const postedJobs = [
    {
      id: "p1",
      title: "Construction Helper",
      location: "Andheri, Mumbai",
      salary: "₹15,000-18,000/month",
      type: "Full-time",
      postedDate: "2024-01-15",
      applicantsCount: 12,
      status: "Active",
    },
    {
      id: "p2",
      title: "Security Guard",
      location: "Whitefield, Bangalore",
      salary: "₹12,000-15,000/month",
      type: "Night Shift",
      postedDate: "2024-01-14",
      applicantsCount: 8,
      status: "Active",
    },
    {
      id: "p3",
      title: "Delivery Partner",
      location: "Sector 18, Noida",
      salary: "₹20,000-25,000/month",
      type: "Full-time",
      postedDate: "2024-01-12",
      applicantsCount: 15,
      status: "Filled",
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                Job Posting Dashboard
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">
                Manage your job postings and find the right candidates
              </p>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center justify-center bg-white text-secondary hover:bg-white/90 
                         font-semibold px-4 sm:px-6 py-2 rounded-lg shadow w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-primary/40 rounded-lg shadow-md">
          <div className="border-b px-4 sm:px-6 py-3 sm:py-4 bg-foreground rounded-t-xl">
            <h2 className="text-base sm:text-lg text-white font-semibold">
              Your Posted Jobs
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {postedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between 
                           p-4 rounded-lg hover:shadow-sm transition-shadow space-y-4 sm:space-y-0"
              >
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {job.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground mt-1 sm:space-x-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span>{job.salary}</span>
                        <span>{job.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Posted on {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      <div
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === "Active"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {job.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side (Applicants + Button) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 sm:ml-6">
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {job.applicantsCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Applicants</p>
                  </div>
                  <Link
                    to={`/job-applicants`}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-muted/50 w-full sm:w-auto text-center"
                  >
                    View Applications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PostJobDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default PostJobs;
