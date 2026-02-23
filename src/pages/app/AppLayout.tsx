import * as React from "react";
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

const drawerWidth = 220;

export default function AppLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/login", { replace: true });
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap component="div">
                        Vitaent Dashboard
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body1">{user?.userName ?? "vitaent"}</Typography>
                        <Button color="inherit" onClick={handleSignOut}>
                            Sign out
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <List>
                    <ListItemButton component={NavLink} to="/app">
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton component={NavLink} to="/app/profile">
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
