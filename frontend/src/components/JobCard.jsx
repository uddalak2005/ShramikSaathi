import { useState } from "react";
import { Link } from "react-router-dom";

const JobCard = ({
  _id,
  title,
  employerId,
  location,
  salary,
  duration,
  createdAt,
  description,
  status,
  skillsRequired = [],
  suggestedWage,
  offeredWage,
}) => {

  const [bidDialogue,setbidDialogue] = useState(false);
  const [offeredBackWage,setOfferedWage] = useState(0);

  const handleOfferWage = async() => {
    try {
      const token = localStorage.getItem("authToken");
      const jobId = _id;

      console.log(jobId);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mandi/bids/createBid`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId : `${jobId}`,
          offeredWage : offeredBackWage
        }),
      });
      if(res.ok){
        console.log("Bid placed");
        setbidDialogue(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptOffer = () => {
    alert("Offer accepted, your employer will contact you shortly");
    setbidDialogue(false);
  }


  return (
    <div className="group border rounded-xl shadow-sm hover:shadow-lg 
    transition-all duration-300 cursor-pointer p-4 bg-white">
      
      {bidDialogue && (
  <div className="bg-black/50 absolute inset-0 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Offer Your Wage
      </h2>

      {/* Suggested Wage */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Suggested Wage
        </label>
        <p className="px-3 py-2 border rounded-md bg-gray-100 text-gray-700">
          ₹{suggestedWage}
        </p>
      </div>

      {/* Offered Wage Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Your Offered Wage
        </label>
        <input
          type="number"
          value={offeredBackWage}
          onChange={(e) => setOfferedWage(e.target.value)}
          placeholder="Enter your offer"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setbidDialogue(false)}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleOfferWage}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Offer Wage
        </button>
        <button
          onClick={handleAcceptOffer} // you'll define this function
          className="px-4 py-2 text-sm rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
        >
          Accept Offer
        </button>
      </div>
    </div>
  </div>
)}




      {/* Header */}
      <div className="pb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500 
            transition-colors">
              {title}
            </h3>
            {status && (
              <span
                className={`${
                  status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                } text-xs px-2 py-0.5 rounded-full`}
              >
                {status}
              </span>
            )}
          </div>

          {/* Employer */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21h18V7H3v14zM3 7l9-4 9 4"
              />
            </svg>
            <span className="font-medium">{employerId}</span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* Location */}
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6 9.5 7.12 9.5 8.5 10.62 11 12 11z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2C8 2 4 6 4 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-6-4-10-8-10z"
                />
              </svg>
              {location?.address}
            </div>

            {/* Salary */}
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                />
              </svg>
              {salary?.toLocaleString()}
            </div>

            {/* Posted Time */}
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <span className="ml-4 border border-gray-300 text-gray-600 text-xs px-2 
        py-0.5 rounded-full">
          {duration}
        </span>
      </div>

      {/* Content */}
      <div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Skills */}
        {skillsRequired?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Wages */}
        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Suggested Wage:</strong> ₹{suggestedWage}/hr
          </p>
          <p>
            <strong>Offered Wage:</strong> ₹{offeredWage}/hr
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/jobs/${_id}`}
            className="flex-1 text-center bg-secondary-foreground
            text-white font-semibold rounded-lg h-10 flex items-center justify-center hover:opacity-90"
          >
            View Details
          </Link>
          <button
            className="flex-1 border border-gray-300 rounded-lg h-10 
            text-gray-700 hover:bg-gray-50"
            onClick={()=> setbidDialogue(!bidDialogue)}
          >
            Quick Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

