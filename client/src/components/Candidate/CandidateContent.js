import { useLocation } from "react-router-dom";
import { useState } from "react";
import Overview from "./Overview";
import ApplicationTracker from "./ApplicationTracker";
import FindJobs from "./FindJobs";
import CareerAdvice from "./CareerAdvice";
import Interviews from "./Interviews";
import { Box } from "@mui/material";

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
    </Box>
  );
};

export default CandidateContent;
