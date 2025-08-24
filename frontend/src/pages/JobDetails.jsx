import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock,
  Building,
  Users,
  Calendar,
  CheckCircle,
  Heart,
  Share2
} from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();

  // Mock job data - in real app, fetch by id
  const job = {
    id: "1",
    title: "Mason Work",
    employer: "Sharma Construction Pvt Ltd",
    location: "Andheri, Mumbai",
    fullAddress: "Plot No. 45, MIDC Industrial Area, Andheri East, Mumbai - 400093",
    salary: "₹15,000-18,000",
    salaryPeriod: "per month",
    type: "Full-time",
    postedTime: "2 hours ago",
    deadline: "Apply by: 25th December 2024",
    experience: "0-2 years",
    openings: "5 positions",
    description:
      "We are looking for dedicated construction helpers to join our team for an ongoing residential project. This is an excellent opportunity for individuals who are hardworking and want to build a career in the construction industry.",
    responsibilities: [
      "Assist skilled workers with construction tasks",
      "Carry and move construction materials",
      "Maintain cleanliness at construction site",
      "Follow safety protocols and wear protective equipment",
      "Support mason, carpenter, and electrician teams"
    ],
    requirements: [
      "Physical fitness and ability to work outdoors",
      "Basic understanding of construction work preferred",
      "Willingness to work in a team environment",
      "Availability for 6 days a week",
      "Own accommodation preferred (we can help arrange if needed)"
    ],
    benefits: [
      "Competitive monthly salary",
      "Overtime pay available",
      "Free safety equipment provided",
      "Skill development opportunities",
      "Transportation allowance",
      "Festival bonuses"
    ],
    contactPerson: "Rajesh Sharma",
    contactPhone: "+91 98765 43210",
    companyInfo: {
      name: "Sharma Construction Pvt Ltd",
      established: "2010",
      employees: "50-100",
      projects: "25+ completed projects",
      rating: 4.2
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            to="/jobs"
            className="inline-flex items-center mb-6 text-white hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>

          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <span className="px-2 py-1 text-sm rounded bg-green-500 text-white">
                    Hiring Now
                  </span>
                </div>

                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <Building className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{job.employer}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    {job.salary} {job.salaryPeriod}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {job.openings}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {job.experience}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Posted {job.postedTime}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                <button className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:opacity-90">
                  Apply Now
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border rounded flex items-center justify-center text-gray-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button className="flex-1 px-3 py-2 border rounded flex items-center justify-center text-gray-700">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
                <p className="text-sm text-red-600 font-medium text-center">
                  {job.deadline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-600 mb-6">{job.description}</p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <hr />

              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <hr />

              <div>
                <h3 className="font-semibold mb-2">Benefits & Perks</h3>
                <ul className="space-y-2">
                  {job.benefits.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">How to Apply</h2>
            <div className="space-y-4 text-sm">
              <div className="bg-gray-100 rounded p-4">
                <h4 className="font-semibold mb-2">Quick Apply Process</h4>
                <p>1. Click "Apply Now" to submit your profile</p>
                <p>2. Review within 24 hours</p>
                <p>3. If selected, interview call</p>
                <p>4. Final interview at site</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-semibold text-blue-600 mb-2">
                  Contact Information
                </h4>
                <p>
                  <span className="font-medium">Contact Person:</span>{" "}
                  {job.contactPerson}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {job.contactPhone}
                </p>
                <p>
                  <span className="font-medium">Office Address:</span>{" "}
                  {job.fullAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-3">About Company</h2>
            <h4 className="font-semibold">{job.companyInfo.name}</h4>
            <p className="text-sm text-gray-600">
              • Established: {job.companyInfo.established}
            </p>
            <p className="text-sm text-gray-600">
              • Team Size: {job.companyInfo.employees}
            </p>
            <p className="text-sm text-gray-600">
              • Experience: {job.companyInfo.projects}
            </p>
            <p className="text-sm text-gray-600">
              • Rating: ⭐ {job.companyInfo.rating}/5.0
            </p>
            <button className="mt-4 w-full border px-3 py-2 rounded hover:bg-gray-100">
              View Company Profile
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-3">Similar Jobs</h2>
            {[
              {
                title: "Mason Helper",
                company: "BuildRight Co.",
                location: "Mumbai",
                salary: "₹16,000"
              },
              {
                title: "Site Worker",
                company: "Metro Construction",
                location: "Mumbai",
                salary: "₹14,000"
              },
              {
                title: "Construction Assistant",
                company: "Urban Builders",
                location: "Mumbai",
                salary: "₹17,000"
              }
            ].map((similarJob, i) => (
              <div
                key={i}
                className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
              >
                <h5 className="font-medium">{similarJob.title}</h5>
                <p className="text-xs text-gray-600">{similarJob.company}</p>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{similarJob.location}</span>
                  <span className="font-medium">{similarJob.salary}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-secondary text-white p-6 rounded text-center">
            <h4 className="font-bold mb-2">Ready to Apply?</h4>
            <p className="text-sm mb-4 opacity-90">
              Join our team and start your career in construction
            </p>
            <button className="w-full px-4 py-2 bg-white text-secondary
             rounded font-semibold hover:bg-gray-200">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
