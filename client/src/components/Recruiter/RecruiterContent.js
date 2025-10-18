import { useLocation, useParams } from "react-router-dom";
import Overview from "./Overview";
import JobPosts from "./JobPosts";
import Applications from "./Applications"; 
import { Box } from "@mui/material";
import Candidates from "./Candidates";
import Interviews from "./Interviews";

import "../../styles/Recruiter.css";

const RecruiterContent = ({showJobForm, setShowJobForm}) => {
  const { jobId } = useParams();
  const location = useLocation();

  return (
    <Box>
      {location.pathname === "/recruiter" && <Overview />}
      {location.pathname === "/recruiter/overview" && <Overview />}
      {location.pathname === "/recruiter/job-posts" && (
        <JobPosts setShowJobForm={setShowJobForm} showJobForm={showJobForm} />
      )}
      {location.pathname.startsWith("/recruiter/job-posts/applicants/") && (
        <Candidates jobId={jobId} />
      )}
      {location.pathname === "/recruiter/candidates" && <Applications />}
      {location.pathname === "/recruiter/interviews" && <Interviews />}

      {/* {location.pathname.startsWith("/pet-owners/view-owner/") && (
            <ViewOwner />
          )} */}
    </Box>
  );
};

export default RecruiterContent;
