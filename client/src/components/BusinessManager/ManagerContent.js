import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import CompanyProfiles from "./CompanyProfiles";
import { Box } from "@mui/material";

const ManagerContent = ({showJobForm, setShowJobForm}) => {
  const location = useLocation();

  return (
    <Box className="manager-content-area">
      {location.pathname === "/manager" && <Overview />}
      {location.pathname === "/manager/overview" && <Overview />}
      {location.pathname === "/manager/company-profiles" && <CompanyProfiles />}
      {/* {location.pathname === "/admin/analytics" && <Analytics />} */}
      {/* {location.pathname.startsWith("/pet-owners/view-owner/") && (
            <ViewOwner />
          )} */}
    </Box>
  );
};

export default ManagerContent;
