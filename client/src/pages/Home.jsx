// client/src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import JobCard from "../component/JobCard";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [gpa, setGpa] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Engineering", "Accounting", "Design", "Marketing", "Sales"];
  const jobTypes = ["Remote", "Onsite", "Full-time"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const limit = 12; // always fetch 12 per page

        const query = new URLSearchParams({
          status: "approved",
          limit,
          page,
          ...(search && { search }),
          ...(location && { location }),
          ...(gpa && { gpa }),
          ...(salary && { salary }),
          ...(jobType && { jobType }),
          ...(selectedCategory && { category: selectedCategory }),
        });

        const res = await fetch(`http://localhost:5000/api/job?${query}`);
        const data = await res.json();

        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [page, search, location, gpa, salary, jobType, selectedCategory]);

  return (
    <div>
      {/* Landing Section */}
      <section className="relative h-[35vh] flex flex-col items-center justify-center text-center text-white px-4 my-8 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold">MS Job Portal</h1>
        <p className="text-base md:text-lg text-green-100 mt-3 max-w-2xl">
          Unlock your career potential — find the right job or hire top talent.
        </p>
        {!user && (
          <a
            href="/register"
            className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full mt-5 hover:bg-green-100 shadow-lg"
          >
            Get Started
          </a>
        )}
      </section>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto mb-6 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat === selectedCategory ? "" : cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <section className="bg-gray-100 py-6 px-4 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/5"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/5"
        />
        <input
          type="number"
          placeholder="Min GPA"
          value={gpa}
          onChange={(e) => setGpa(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/6"
        />
        <input
          type="text"
          placeholder="Salary (number or scale)"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/6"
        />
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/6"
        >
          <option value="">All Job Types</option>
          {jobTypes.map((jt) => (
            <option key={jt} value={jt}>
              {jt}
            </option>
          ))}
        </select>
        <button
          onClick={() => setPage(1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Apply Filters
        </button>
      </section>

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
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
