// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import JobCard from "@/component/JobCard";
import { Briefcase, ArrowRight, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs?status=approved&limit=6");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching featured jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ======= Navbar ======= */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-extrabold text-green-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            JobPortal
          </h1>
          <div className="flex gap-6 text-gray-700 font-medium">
            <button onClick={() => navigate("/")} className="hover:text-green-700">
              Home
            </button>
            <button onClick={() => navigate("/jobs")} className="hover:text-green-700">
              Jobs
            </button>
            <button onClick={() => navigate("/recruiter")} className="hover:text-green-700">
              Recruiter
            </button>
            <button onClick={() => navigate("/login")} className="hover:text-green-700">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ======= Hero Section ======= */}
      <section className="text-center py-32 bg-gradient-to-r from-green-700 to-green-500 text-white mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4">
            Find Your Dream Job Easily
          </h1>
          <p className="text-lg text-green-50 max-w-2xl mx-auto mb-8">
            Explore opportunities from trusted employers and take the next step in your career journey.
          </p>
          <Button
            onClick={() => navigate("/jobs")}
            className="bg-white text-green-700 hover:bg-green-100 font-semibold"
          >
            Browse All Jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ======= Featured Jobs ======= */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-700 flex items-center gap-2">
            <Briefcase className="h-6 w-6" /> Featured Jobs
          </h2>
          <Button
            onClick={() => navigate("/jobs")}
            variant="outline"
            className="text-green-700 border-green-600 hover:bg-green-50"
          >
            View All
          </Button>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* ======= Recruiter CTA ======= */}
      <section className="bg-green-700 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Building2 className="h-7 w-7" /> Hire the Best Talent
          </h2>
          <p className="text-green-100 max-w-xl mx-auto mb-8">
            Looking to grow your team? Post your job openings and reach thousands of talented candidates.
          </p>
          <Button
            onClick={() => navigate("/register")}
            className="bg-white text-green-700 hover:bg-green-100 font-semibold"
          >
            Post a Job Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ======= Footer ======= */}
      <footer className="bg-green-800 text-green-100 text-center py-6 mt-auto">
        <div className="container mx-auto">
          <div className="flex justify-center gap-8 mb-2">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
