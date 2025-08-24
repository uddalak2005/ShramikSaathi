import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const JobApplicants = ({ toast }) => {
  const { jobId } = useParams();

  // Mock job data
  const jobData = {
    id: "p1",
    title: "Construction Helper",
    location: "Andheri, Mumbai",
    salary: "₹15,000-18,000/month",
    type: "Full-time",
    postedDate: "2024-01-15",
    status: "Active"
  };

  // Mock applicants
  const applicants = [
    {
      id: "a1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 9876543210",
      location: "Kandivali, Mumbai",
      experience: "3 years",
      skills: ["Construction", "Brick Laying", "Concrete Work"],
      appliedDate: "2024-01-16",
      status: "pending",
      rating: 4.5,
      bio: "Experienced construction worker with 3 years in residential and commercial projects. Reliable and hardworking."
    },
    {
      id: "a2",
      name: "Suresh Patil",
      email: "suresh.patil@email.com",
      phone: "+91 8765432109",
      location: "Borivali, Mumbai",
      experience: "5 years",
      skills: ["Construction", "Plumbing", "Electrical Work"],
      appliedDate: "2024-01-16",
      status: "accepted",
      rating: 4.8,
      bio: "Senior construction helper with expertise in multiple trades. Team leader experience."
    },
    {
      id: "a3",
      name: "Amit Singh",
      email: "amit.singh@email.com",
      phone: "+91 7654321098",
      location: "Malad, Mumbai",
      experience: "2 years",
      skills: ["Construction", "Material Handling"],
      appliedDate: "2024-01-17",
      status: "rejected",
      rating: 4.2,
      bio: "Dedicated worker with good physical strength and willingness to learn new skills."
    },
    {
      id: "a4",
      name: "Mohammad Ali",
      email: "mohammad.ali@email.com",
      phone: "+91 6543210987",
      location: "Jogeshwari, Mumbai",
      experience: "4 years",
      skills: ["Construction", "Scaffolding", "Safety"],
      appliedDate: "2024-01-17",
      status: "pending",
      rating: 4.6,
      bio: "Safety-conscious construction worker with scaffolding certification."
    }
  ];

  const handleApplicationAction = (applicantId, action) => {
    alert(`Applicant ${action}ed: ${applicantId}`);
  };

  const getStatusBadge = (status) => {
    let colorClass = "bg-gray-100 text-gray-700";
    let label = status;

    if (status === "pending") {
      colorClass = "bg-orange-100 text-orange-600";
      label = "Pending";
    } else if (status === "accepted") {
      colorClass = "bg-green-100 text-green-600";
      label = "Accepted";
    } else if (status === "rejected") {
      colorClass = "bg-red-100 text-red-600";
      label = "Rejected";
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  const filteredApplicants = {
    all: applicants,
    pending: applicants.filter(a => a.status === 'pending'),
    accepted: applicants.filter(a => a.status === 'accepted'),
    rejected: applicants.filter(a => a.status === 'rejected')
  };

  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <Link
              to="/post-jobs"
              className="inline-flex items-center px-3 py-2 bg-white text-secondary rounded hover:bg-gray-100 mb-2"
            >
              &#8592; Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{jobData.title}</h1>
            <p className="opacity-80">{jobData.location} • {jobData.salary}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{applicants.length}</p>
            <p className="text-sm opacity-80">Total Applications</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex space-x-2 mb-6">
          {Object.keys(filteredApplicants).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? "bg-secondary text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({filteredApplicants[tab].length})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {filteredApplicants[activeTab].length === 0 && (
            <div className="p-12 text-center bg-white rounded shadow">
              No applicants in this category yet.
            </div>
          )}

          {filteredApplicants[activeTab].map((applicant) => (
            <div key={applicant.id} className="bg-white rounded shadow p-6 hover:shadow-md flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">
                  {applicant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">{applicant.name}</h3>
                    {getStatusBadge(applicant.status)}
                    <span className="text-sm font-medium ml-2">&#9733; {applicant.rating}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{applicant.bio}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                    <div>{applicant.email}</div>
                    <div>{applicant.phone}</div>
                    <div>{applicant.location}</div>
                    <div>{applicant.experience} experience</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {applicant.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 text-right">
                <p className="text-xs text-gray-500">Applied on {new Date(applicant.appliedDate).toLocaleDateString()}</p>
                <div className="flex justify-end space-x-2">
                  
                  {applicant.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApplicationAction(applicant.id, 'accept')}
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleApplicationAction(applicant.id, 'reject')}
                        className="px-2 py-1 border border-red-600 text-red-600 rounded text-sm hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobApplicants;
