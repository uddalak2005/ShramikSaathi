import { useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "lucide-react";
const Register = () => {
  const [formStep, setFormStep] = useState(1);

  const nextStep = () => setFormStep(Math.min(formStep + 1, 3));
  const prevStep = () => setFormStep(Math.max(formStep - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center mb-6 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
            <p className="text-gray-500 mt-1">Join thousands of workers finding better opportunities</p>

            {/* Progress */}
            <div className="flex justify-center mt-4 space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step <= formStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Basic Info */}
            {formStep === 1 && (
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
                  <input className="w-full h-12 border rounded-lg px-3" id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
                  <input className="w-full h-12 border rounded-lg px-3" id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
                  <input className="w-full h-12 border rounded-lg px-3" id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                  <input className="w-full h-12 border rounded-lg px-3" id="password" type="password" placeholder="Create a strong password" />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 0v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" />
                    </svg>
                    Preferred Language
                  </label>
                  <select className="w-full h-12 border rounded-lg px-3">
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>
                <button type="button" onClick={nextStep} className="w-full h-12 bg-gradient-to-tr from-orange-400 to-yellow-300 text-white font-semibold rounded-lg hover:opacity-90 mt-6">Continue</button>
              </form>
            )}

            {/* Step 2: Personal Details */}
            {formStep === 2 && (
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="aadhar">Aadhar Number (Optional)</label>
                  <input className="w-full h-12 border rounded-lg px-3" id="aadhar" placeholder="Enter your Aadhar number" />
                  <p className="text-xs text-gray-500">This helps employers verify your identity securely</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="address">Current Address</label>
                  <textarea className="w-full border rounded-lg px-3 py-2 min-h-[100px]" id="address" placeholder="Enter your current address" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="city">Current City</label>
                  <select className="w-full h-12 border rounded-lg px-3">
                    <option value="">Select your city</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="chennai">Chennai</option>
                    <option value="kolkata">Kolkata</option>
                    <option value="pune">Pune</option>
                    <option value="ahmedabad">Ahmedabad</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="role">What type of work are you looking for?</label>
                  <select className="w-full h-12 border rounded-lg px-3">
                    <option value="">Select work type</option>
                    <option value="construction">Construction Worker</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="security">Security Guard</option>
                    <option value="delivery">Delivery Person</option>
                    <option value="factory">Factory Worker</option>
                    <option value="cook">Cook/Kitchen Helper</option>
                    <option value="driver">Driver</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={prevStep} className="flex-1 h-12 border rounded-lg">Previous</button>
                  <button type="button" onClick={nextStep} className="flex-1 h-12 bg-gradient-to-tr from-orange-400 to-yellow-300 text-white font-semibold rounded-lg">Continue</button>
                </div>
              </form>
            )}

            {/* Step 3: Agreement */}
            {formStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-lg p-4 space-y-2 text-sm text-gray-700">
                  <p>✓ Personal information completed</p>
                  <p>✓ Contact details verified</p>
                  <p>✓ Work preferences set</p>
                  <p>✓ Location preferences set</p>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I agree to the <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link></span>
                  </label>
                  <label className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" />
                    <span>I want to receive job alerts and community updates via SMS and email</span>
                  </label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={prevStep} className="flex-1 h-12 border rounded-lg">Previous</button>
                  <button type="submit" className="flex-1 h-12 bg-gradient-to-tr from-orange-400 to-yellow-300 text-white font-semibold rounded-lg hover:opacity-90">Create Account</button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center pt-6 border-t mt-6">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline font-semibold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-500">Join 15,000+ workers already on WorkBridge</p>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>✓ Free to Join</span>
            <span>✓ Secure Data</span>
            <span>✓ Verified Jobs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
