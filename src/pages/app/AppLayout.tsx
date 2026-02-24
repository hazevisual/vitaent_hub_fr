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
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTheme } from "@mui/material/styles";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

const drawerWidth = 248;

const navItems = [
  { label: "Home", to: "/app", icon: <HomeRoundedIcon fontSize="small" /> },
  { label: "Profile", to: "/app/profile", icon: <PersonRoundedIcon fontSize="small" /> },
];

export default function AppLayout() {
  const { user, signOut } = useAuth();
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
      <Toolbar sx={{ minHeight: { xs: 68, md: 74 } }} />
      <Divider sx={{ mb: 1.5 }} />
      <List disablePadding>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={handleNavClick}
            sx={{ gap: 1.4, py: 1.1, px: 1.4, color: "text.secondary" }}
          >
            {item.icon}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
                color: location.pathname === item.to ? "text.primary" : "text.secondary",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", overflowX: "hidden" }}>
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
        <Toolbar sx={{ minHeight: { xs: 68, md: 74 }, px: { xs: 1.25, sm: 2.5, md: 3 } }}>
          {!isDesktop && (
            <IconButton onClick={handleDrawerToggle} sx={{ mr: 1 }} aria-label="open navigation menu">
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "rgba(140, 167, 220, 0.18)",
                color: "primary.dark",
                display: "grid",
                placeItems: "center",
              }}
            >
              <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", sm: "1.1rem" } }}>
              Vitaent
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.5 }, ml: "auto" }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", maxWidth: { xs: 110, sm: 200 }, textOverflow: "ellipsis", overflow: "hidden" }}
            >
              {user?.userName ?? "vitaent"}
            </Typography>
            <Button variant="text" color="inherit" onClick={handleSignOut} sx={{ color: "text.secondary", minWidth: 0, px: 1 }}>
              Sign out
            </Button>
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
          flex: 1,
          minWidth: 0,
          width: "100%",
          pb: { xs: 1.5, md: 2.5 },
          overflowX: "clip",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 68, md: 74 } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
