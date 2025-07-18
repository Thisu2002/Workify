import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import CompanyProfiles from "./CompanyProfiles";
import Users from "./Users";
import RegistrationRequests from "./RegistrationRequests";
import MentorVerification from "./MentorVerification";
import BlacklistRequest from "./BlacklistRequest";
import SubscriptionPlans from "./SubscriptionPlans";
import { Box } from "@mui/material";

const ManagerContent = ({showJobForm, setShowJobForm}) => {
  const location = useLocation();

  return (
    <Box className="manager-content-area">
      {location.pathname === "/manager" && <Overview />}
      {location.pathname === "/manager/overview" && <Overview />}
      {location.pathname === "/manager/company-profiles" && <CompanyProfiles />}
      {location.pathname === "/manager/userAccounts" && <Users />}
      {location.pathname === "/manager/registration-requests" && <RegistrationRequests />}
      {location.pathname === "/manager/mentor-verification" && <MentorVerification />}
      {location.pathname === "/manager/blacklist-requests" && <BlacklistRequest />}
      {location.pathname === "/manager/subscription-plans" && <SubscriptionPlans />}
      {/* {location.pathname === "/admin/analytics" && <Analytics />} */}
      {/* {location.pathname.startsWith("/pet-owners/view-owner/") && (
            <ViewOwner />
          )} */}
    </Box>
  );
};

export default ManagerContent;
