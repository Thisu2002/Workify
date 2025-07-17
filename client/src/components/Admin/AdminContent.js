import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import Analytics from "./Analytics";
import { Box } from "@mui/material";
import Users from "./users";

const AdminContent = ({showJobForm, setShowJobForm}) => {
  const location = useLocation();

  return (
    <Box className="admin-content-area">
      {location.pathname === "/admin" && <Overview />}
      {location.pathname === "/admin/overview" && <Overview />}
      {location.pathname === "/admin/analytics" && <Analytics />}
      {location.pathname === "/admin/users" && <Users />}
      {/* {location.pathname.startsWith("/pet-owners/view-owner/") && (
            <ViewOwner />
          )} */}
    </Box>
  );
};

export default AdminContent;
