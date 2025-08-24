import { useState } from "react";
import { Link } from "react-router-dom";

const JobApplications = () => {
  const applications = [
    {
      id: "1",
      jobTitle: "Construction Helper",
      company: "Sharma Construction Pvt Ltd",
      location: "Andheri, Mumbai",
      appliedDate: "2024-12-20",
      status: "in-review",
      statusText: "In Review",
      salary: "₹15,000-18,000",
      nextStep: "Interview scheduled for Dec 22, 2024",
      contactPerson: "Rajesh Sharma",
      contactPhone: "+91 98765 43210"
    },
    {
      id: "2",
      jobTitle: "Security Guard",
      company: "SecureMax Solutions", 
      location: "Whitefield, Bangalore",
      appliedDate: "2024-12-18",
      status: "selected",
      statusText: "Selected",
      salary: "₹12,000-15,000",
      nextStep: "Document verification pending",
      contactPerson: "Priya Reddy",
      contactPhone: "+91 87654 32109"
    },
    {
      id: "3",
      jobTitle: "Delivery Partner",
      company: "QuickDeliver Logistics",
      location: "Sector 18, Noida", 
      appliedDate: "2024-12-15",
      status: "rejected",
      statusText: "Not Selected",
      salary: "₹20,000-25,000",
      nextStep: "Thank you for applying. We'll keep your profile for future opportunities.",
      contactPerson: null,
      contactPhone: null
    },
    {
      id: "4",
      jobTitle: "Kitchen Helper",
      company: "Spice Garden Restaurant",
      location: "CP, New Delhi",
      appliedDate: "2024-12-22",
      status: "submitted",
      statusText: "Application Submitted",
      salary: "₹14,000-16,000",
      nextStep: "Your application is being reviewed",
      contactPerson: null,
      contactPhone: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-gray-200 text-gray-700';
      case 'in-review': return 'bg-blue-200 text-blue-800';
      case 'selected': return 'bg-green-200 text-green-800';
      case 'rejected': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return '⏰';
      case 'in-review': return '⚠️';
      case 'selected': return '✔️';
      case 'rejected': return '❌';
      default: return '⏰';
    }
  };

  const filterApplications = (status) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
  };

  const ApplicationCard = ({ application }) => (
    <div className="bg-white rounded shadow p-4 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{application.jobTitle}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>🏢 {application.company}</div>
            <div>📍 {application.location}</div>
            <div>📅 Applied on {new Date(application.appliedDate).toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 mt-2 md:mt-0">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)} {application.statusText}
          </span>
          <span className="text-sm font-medium mt-1">{application.salary}</span>
        </div>
      </div>

      <div className="bg-gray-100 rounded p-3 mt-3">
        <h4 className="font-medium mb-1">Next Steps:</h4>
        <p className="text-sm text-gray-700">{application.nextStep}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <Link
          to={`/jobs/${application.id}`}
          className="flex-1 px-3 py-2 border rounded text-center hover:bg-gray-100"
        >
          👁️ View Job Details
        </Link>

        {application.contactPerson && (
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            📞 Contact Employer
          </button>
        )}
      </div>
    </div>
  );

  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Link to="/jobs" className="inline-flex items-center mb-4 text-white hover:opacity-80">
            ← Back to Jobs
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Job Applications</h1>
            <p className="mt-1 opacity-80">Track and manage all your job applications</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <span className="opacity-80 text-sm">Total Applications: <strong>{applications.length}</strong></span>
            <Link to="/jobs" className="px-3 py-2 border rounded hover:bg-white hover:text-blue-600">
              Find More Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {['submitted','in-review','selected','rejected'].map((status) => (
            <div key={status} className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {applications.filter(app => app.status === status).length}
              </div>
              <div className="text-sm text-gray-600">
                {status === 'submitted' && 'Submitted'}
                {status === 'in-review' && 'In Review'}
                {status === 'selected' && 'Selected'}
                {status === 'rejected' && 'Not Selected'}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {['all','submitted','in-review','selected','rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {tab === 'all' ? 'All' : tab === 'in-review' ? 'In Review' : tab === 'rejected' ? 'Not Selected' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {' (' + (tab==='all'? applications.length : applications.filter(app => app.status === tab).length) + ')'}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filterApplications(activeTab).map(application => (
            <ApplicationCard key={application.id} application={application} />
          ))}
          {filterApplications(activeTab).length === 0 && (
            <div className="p-6 text-center bg-white rounded shadow">No applications in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
