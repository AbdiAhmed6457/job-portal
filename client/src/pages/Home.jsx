// client/src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import JobCard from "../component/JobCard";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch jobs dynamically
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const limit = user ? 12 : 6; // less jobs for guests
        const query = new URLSearchParams({
          status: "approved",
          limit,
          page,
          search,
          location,
        });

        const res = await fetch(`http://localhost:5000/api/job?${query}`);
        const data = await res.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, [user, page, search, location]);

  return (
    <div>
      {/* Landing section */}
     <section
  className="relative h-[40vh] flex flex-col items-center justify-center text-center text-white px-4 my-8"
 
>
  <h1 className="text-3xl md:text-4xl font-bold text-white animate-fadeIn">
    MS Job Portal
  </h1>
  <p className="text-base md:text-lg text-green-100 max-w-2xl mx-auto mt-3 animate-fadeIn delay-200">
    Unlock your career potential — Find the right job or hire the best talent.
  </p>
  {!user && (
    <a
      href="/register"
      className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg mt-5 transition-colors hover:bg-green-100 animate-fadeIn delay-400"
    >
      Get Started
    </a>
  )}
</section>



      

      {/* Filter Bar (only for logged-in users) */}
      {user && (
        <section className="bg-gray-100 py-6 px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search by job title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
          />
          <input
            type="text"
            placeholder="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
          />
          <button
            onClick={() => setPage(1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Apply Filters
          </button>
        </section>
      )}

      {/* Job List */}
      <section id="jobs" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Latest Jobs</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
