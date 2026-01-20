import { Bell } from "lucide-react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon
} from "@mui/material";
import KeyIcon from "@mui/icons-material/VpnKey";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState({});
  const open = Boolean(anchorEl);

  // ⭐ LOAD PROFILE ONCE ON PAGE LOAD + AFTER LOGIN
  useEffect(() => {
    // Load cached profile firs
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }  

    // Fetch from backend
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:5000/api/agent/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        localStorage.setItem("profile", JSON.stringify(data));
      })
      .catch((err) =>
        console.error("Profile Fetch Error:", err)
      );
  }, []);

  // ⭐ Avatar only opens menu (no fetch here!)
  const handleAvatarClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/login");
  };

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 2,
        px: 3,
        width: "100%"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1830px",
          mx: "auto"
        }}
      >
        {/* Left Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box component="img" src={logo} alt="Digi Khata Logo" sx={{ height: 32 }} />

          {!isMobile && (
            <>
              <Divider orientation="vertical" flexItem sx={{ height: 24 }} />
              <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                Hello, {profile.agentName || "Agent"} 👋
              </Typography>
            </>
          )}
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 3 }}>
          <Avatar
            onClick={handleAvatarClick}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
              cursor: "pointer"
            }}
          >
            {profile.agentName ? profile.agentName[0] : "A"}
          </Avatar>

          {!isMobile && (
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {profile.agentName || "Agent Name"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Agent
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: { width: 260, borderRadius: 3, p: 1 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography fontWeight="bold">{profile.agentName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/change-password");
          }}
        >
          <ListItemIcon>
            <KeyIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
