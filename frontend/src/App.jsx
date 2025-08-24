import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetails";
// import JobApplications from "./pages/JobApplications";
import Community from "./pages/Community";
// import Profile from "./pages/Profile";
import Legal from "./pages/Legal";
import Loans from "./pages/Loans";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/WorkerProfile";
// import NotFound from "./pages/NotFound";
import JobApplicants from "./pages/JobApplicants";
import PostJobs from "./pages/PostJobs";
import ShramikSaathi from "./pages/rag";

// No-op TooltipProvider replacement
const TooltipProvider = ({ children }) => <>{children}</>;

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            {/* <Route path="job-applications" element={<JobApplications />} /> */}
            <Route path="community" element={<Community />} />
            {/* <Route path="profile" element={<Profile />} /> */}
            <Route path="legal" element={<Legal />} />
            <Route path="loans" element={<Loans />} />
            <Route path="/profile/:token" element={<Profile />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/job-application" element={<JobApplications />} /> */}
          <Route path="/job-applicants" element={<JobApplicants />} />
          <Route path="/post-jobs" element={<PostJobs />} />
          <Route path="/rag" element={<ShramikSaathi />} />

          {/* Catch-all 404 route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </AuthProvider>
);

export default App;
