import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/Textarea"; // shadcn or custom

const JobForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    gpaMin: "",
    location: "",
    salary: "",
    category: "",
    jobType: "",
    expiresAt: "",
  });

  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert requirements string to array
    const requirementsArray = formData.requirements
      .split(/[\s,]+/)       // split by comma or space
      .map((r) => r.trim())
      .filter((r) => r);     // remove empty strings

    try {
      const token = localStorage.getItem("token");

      // Send array to backend; backend will stringify it
      await axios.post(
        "http://localhost:5000/api/job",
        {
          ...formData,
          requirements: requirementsArray, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/recruiter/dashboard"); // redirect after success
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <Textarea
        label="Job Description"
        name="description"
        placeholder="Describe the job..."
        value={formData.description}
        onChange={(e) =>
          handleChange({ target: { name: "description", value: e.target.value } })
        }
      />

      <Textarea
        label="Requirements (comma or space separated)"
        name="requirements"
        placeholder="React, Node, Express"
        value={formData.requirements}
        onChange={(e) =>
          handleChange({ target: { name: "requirements", value: e.target.value } })
        }
      />

      <input
        type="number"
        name="gpaMin"
        placeholder="Minimum GPA"
        value={formData.gpaMin}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={formData.salary}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Category</option>
        <option value="Engineering">Engineering</option>
        <option value="Marketing">Marketing</option>
        <option value="Design">Design</option>
      </select>

      <select
        name="jobType"
        value={formData.jobType}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Job Type</option>
        <option value="fulltime">Full Time</option>
        <option value="parttime">Part Time</option>
        <option value="internship">Internship</option>
      </select>

      <input
        type="date"
        name="expiresAt"
        value={formData.expiresAt}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Create Job
      </button>
    </form>
  );
};

export default JobForm;
