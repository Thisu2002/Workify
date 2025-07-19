import { useLocation } from "react-router-dom";
import { useState } from "react";
import Overview from "./Overview";
import ApplicationTracker from "./ApplicationTracker";
import FindJobs from "./FindJobs";
import CareerAdvice from "./CareerAdvice";
import Interviews from "./Interviews";
import CandidateProfile from './Profile';
import { Box } from "@mui/material";

// Mock data is now self-contained within the component that uses it.
const mockCandidate = {
  name: "Sajani Ranaweera",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
  headline: "Aspiring Software Engineer • 3 years experience",
  contact: {
    email: "sajani@email.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    linkedinUrl: "https://linkedin.com/in/sajani"
  },
  skills: ["React", "Node.js", "UI/UX", "JavaScript", "Material UI", "Redux"],
  about: "Passionate and detail-oriented Frontend Developer with three years of experience creating and maintaining responsive web applications. Proficient in React, MUI, and modern JavaScript, with a strong focus on building user-friendly interfaces and seamless user experiences.",
  experience: [
    {
      title: "Frontend Developer",
      company: "Wealth OS",
      dates: "2022 - Present",
      description: "• Developed and maintained modern, responsive web applications using React and Material-UI (MUI).\n• Collaborated with designers and backend developers to implement new features and enhance user experience.\n• Wrote clean, efficient, and maintainable code, adhering to best practices and coding standards."
    }
  ],
  education: [
    {
      degree: "BSc in Computer Science",
      school: "University of Colombo School of Computing",
      dates: "2018 - 2022"
    }
  ]
};

const CandidateContent = () => {
  const location = useLocation();
  const [trackerTab, setTrackerTab] = useState(0);
  return (
    <Box className="recruiter-content-area">
      {(location.pathname === "/candidate" || location.pathname === "/candidate/overview") && (
        <>
          <Overview />
          <ApplicationTracker trackerTab={trackerTab} setTrackerTab={setTrackerTab} />
        </>
      )}
      {location.pathname === "/candidate/findjob" && <FindJobs />}
      {location.pathname === "/candidate/careeradvice" && <CareerAdvice />}
      {location.pathname === "/candidate/interviews" && <Interviews />}
      {location.pathname === "/candidate/profile" && <CandidateProfile candidate={mockCandidate} />}
    </Box>
  );
};

export default CandidateContent;