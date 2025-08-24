import { useState } from "react";

const PostJobDialog = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "",
    duration: "",
    requirements: "",
    benefits: ""
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Job posting data:", { ...formData, startDate, endDate });
    alert("Job Posted Successfully! Your job posting is now live.");

    setFormData({
      title: "",
      description: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      jobType: "",
      duration: "",
      requirements: "",
      benefits: ""
    });
    setStartDate("");
    setEndDate("");
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Post a New Job</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium">Job Title *</label>
            <input
              id="title"
              type="text"
              className="w-full border rounded p-2"
              placeholder="e.g., Construction Helper, Security Guard"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="font-medium">Location *</label>
            <input
              id="location"
              type="text"
              className="w-full border rounded p-2"
              placeholder="e.g., Andheri, Mumbai"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <label className="font-medium">Job Type</label>
            <select
              className="w-full border rounded p-2"
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
            >
              <option value="">Select job type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="night-shift">Night Shift</option>
              <option value="weekend">Weekend Only</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="salaryMin" className="font-medium">Min Salary (₹/month)</label>
              <input
                id="salaryMin"
                type="number"
                className="w-full border rounded p-2"
                placeholder="10000"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="salaryMax" className="font-medium">Max Salary (₹/month)</label>
              <input
                id="salaryMax"
                type="number"
                className="w-full border rounded p-2"
                placeholder="15000"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label htmlFor="duration" className="font-medium">Contract Duration</label>
            <select
              id="duration"
              className="w-full border rounded p-2"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            >
              <option value="">Select duration</option>
              <option value="permanent">Permanent</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="1-year">1 Year</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium">Start Date</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium">End Date (Optional)</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="font-medium">Job Description *</label>
            <textarea
              id="description"
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Describe the job responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label htmlFor="requirements" className="font-medium">Requirements & Skills</label>
            <textarea
              id="requirements"
              className="w-full border rounded p-2"
              rows="3"
              placeholder="List the required skills, experience, and qualifications..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <label htmlFor="benefits" className="font-medium">Benefits & Perks</label>
            <textarea
              id="benefits"
              className="w-full border rounded p-2"
              rows="3"
              placeholder="List benefits like food, accommodation, transport, bonuses, etc..."
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              className="px-4 py-2 border rounded"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobDialog;
