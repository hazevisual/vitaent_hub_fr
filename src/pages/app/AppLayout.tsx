import * as React from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import MoodRoundedIcon from "@mui/icons-material/MoodRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { useTheme } from "@mui/material/styles";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

const drawerWidth = 248;
const appBarOffset = { xs: 68, md: 74 };
const contentColumnMaxWidth = 1920;

function VitaentLogo() {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", minWidth: 0 }} aria-label="Vitaent logo">
      <Box
        component="svg"
        viewBox="0 0 124 24"
        role="img"
        aria-hidden="true"
        sx={{ height: 24, width: "auto", display: "block" }}
      >
        <rect x="1" y="1" width="22" height="22" rx="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7 13h4l2-4 2 8 2-4h3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="16" fontFamily="Inter, Segoe UI, Roboto, sans-serif" fontSize="13" fontWeight="600" fill="currentColor">
          Vitaent
        </text>
      </Box>
    </Box>
  );
}

const navItems = [
  { label: "Главная", to: "/app", icon: <HomeRoundedIcon fontSize="small" /> },
  { label: "Профиль", to: "/app/profile", icon: <PersonRoundedIcon fontSize="small" /> },
  { label: "Режим дня / Сон", to: "/app/sleep", icon: <BedtimeRoundedIcon fontSize="small" /> },
  { label: "Эмоции", to: "/app/emotions", icon: <MoodRoundedIcon fontSize="small" /> },
  { label: "Сообщения", to: "/app/messages", icon: <ChatBubbleOutlineRoundedIcon fontSize="small" /> },
  { label: "Лекарства", to: "/app/medicines", icon: <MedicationRoundedIcon fontSize="small" /> },
  { label: "Болезнь", to: "/app/diseases/1", icon: <FavoriteBorderRoundedIcon fontSize="small" /> },
];

export default function AppLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ minHeight: appBarOffset }} />
      <Divider sx={{ mb: 1.5 }} />
      <List disablePadding>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)}
            onClick={handleNavClick}
            sx={{
              gap: 1.4,
              py: 1.1,
              px: 1.4,
              color: "text.secondary",
              "& .MuiListItemText-primary": {
                color: "text.secondary",
              },
              "& .nav-icon": {
                color: "text.secondary",
              },
              "&.Mui-selected .MuiListItemText-primary, &.Mui-selected .nav-icon": {
                color: "primary.main",
              },
            }}
          >
            <Box className="nav-icon" sx={{ display: "inline-flex", alignItems: "center" }}>
              {item.icon}
            </Box>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", alignItems: "stretch", width: "100%", minWidth: 0, minHeight: "100vh", bgcolor: "background.default", overflowX: "hidden" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ minHeight: appBarOffset, px: { xs: 1.25, sm: 2.5, md: 3 } }}>
          <Box sx={{ width: "100%", maxWidth: contentColumnMaxWidth, mx: "auto", minWidth: 0, display: "flex", alignItems: "center" }}>
            {!isDesktop && (
              <IconButton onClick={handleDrawerToggle} sx={{ mr: 1 }} aria-label="open navigation menu">
                <MenuRoundedIcon />
              </IconButton>
            )}

            <Box sx={{ color: "primary.main" }}>
              <VitaentLogo />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.5 }, ml: "auto" }}>
              <IconButton aria-label="Profile" size="small">
                <PersonRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Settings" size="small">
                <SettingsRoundedIcon fontSize="small" />
              </IconButton>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSignOut}
                sx={{
                  minWidth: 0,
                  px: 1.75,
                  height: 34,
                  borderWidth: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}
              >
                Выйти
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="sidebar navigation">
        <Drawer
          variant="temporary"
          open={!isDesktop && mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              px: 2,
              pt: 1.5,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              px: 2,
              pt: 1.5,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          flex: 1,
          minWidth: 0,
          width: "100%",
          pb: { xs: 1.5, md: 2.5 },
          overflowX: "hidden",
        }}
      >
        <Toolbar sx={{ minHeight: appBarOffset }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            width: "100%",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
