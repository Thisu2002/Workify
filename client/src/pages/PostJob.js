import React, { useState } from "react";
import "../styles/PostJob.css";
import toast from "react-hot-toast";

const PostJob = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        salary: ""
    });
    const [postedJob, setPostedJob] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Job posted successfully!");
        setPostedJob(form); // Save the posted job details
        setForm({ title: "", description: "", location: "", salary: "" });
    };

    return (
        <div className="post-job-container">
            <h1>Post a Job</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Job Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Salary:</label>
                    <input
                        type="number"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Post Job</button>
            </form>

            {postedJob && (
                <div className="posted-job-details">
                    <h2>Posted Job Details</h2>
                    <p><strong>Title:</strong> {postedJob.title}</p>
                    <p><strong>Description:</strong> {postedJob.description}</p>
                    <p><strong>Location:</strong> {postedJob.location}</p>
                    <p><strong>Salary:</strong> {postedJob.salary}</p>
                </div>
            )}
        </div>
    );
};

export default PostJob;