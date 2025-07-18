import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import JobPosts from "./JobPosts";
import Applications from "./Applications"; 
import { Box } from "@mui/material";
import Candidates from "./Candidates";
import "../../styles/Recruiter.css";

const RecruiterContent = ({showJobForm, setShowJobForm}) => {
  const location = useLocation();

  return (
    <Box>
      {location.pathname === "/recruiter" && <Overview />}
      {location.pathname === "/recruiter/overview" && <Overview />}
      {location.pathname === "/recruiter/job-posts" && (
        <JobPosts setShowJobForm={setShowJobForm} showJobForm={showJobForm} />
      )}
      {location.pathname === "/recruiter/job-posts/applicants" && <Candidates />}
      {location.pathname === "/recruiter/applications" && <Applications />}
      {/* {location.pathname.startsWith("/pet-owners/view-owner/") && (
            <ViewOwner />
          )} */}
    </Box>
  );
};

export default RecruiterContent;
