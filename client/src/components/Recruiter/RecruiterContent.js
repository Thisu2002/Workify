import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import JobPosts from "./JobPosts";
import { Box } from "@mui/material";

const RecruiterContent = ({showJobForm, setShowJobForm}) => {
  const location = useLocation();

  return (
    <Box className="recruiter-content-area">
      {location.pathname === "/recruiter" && <Overview />}
      {location.pathname === "/recruiter/overview" && <Overview />}
      {location.pathname === "/recruiter/job-posts" && (
        <JobPosts setShowJobForm={setShowJobForm} showJobForm={showJobForm} />
      )}
      {/* {location.pathname.startsWith("/pet-owners/view-owner/") && (
            <ViewOwner />
          )} */}
    </Box>
  );
};

export default RecruiterContent;
