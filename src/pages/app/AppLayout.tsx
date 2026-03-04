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
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MoodRoundedIcon from "@mui/icons-material/MoodRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { isAdminUser, isDoctorUser } from "@/auth/roleRouting";
import { Paths } from "@/paths";
import logoVitaentFull from "@/assets/LogoVitaentFull.svg";

const drawerWidth = 248;
const appBarOffset = { xs: 68, md: 74 };
const contentColumnMaxWidth = 1920;

const patientNavItems = [
  { label: "Главная", to: Paths.patientHome, icon: <DashboardRoundedIcon fontSize="small" /> },
  { label: "Неделя", to: Paths.patientWeekDays, icon: <CalendarTodayRoundedIcon fontSize="small" /> },
  { label: "Сон", to: Paths.patientSleep, icon: <BedtimeRoundedIcon fontSize="small" /> },
  { label: "Эмоции", to: Paths.patientEmotions, icon: <MoodRoundedIcon fontSize="small" /> },
  { label: "Лекарства", to: Paths.patientMedicines, icon: <MedicationRoundedIcon fontSize="small" /> },
  { label: "Чат", to: Paths.patientChat, icon: <ChatBubbleOutlineRoundedIcon fontSize="small" /> },
  { label: "Профиль", to: Paths.patientProfile, icon: <PersonRoundedIcon fontSize="small" /> },
];

const doctorNavItems = [
  { label: "Рабочее место", to: Paths.doctorHome, icon: <DashboardRoundedIcon fontSize="small" /> },
  { label: "Приемы", to: Paths.doctorAppointments, icon: <CalendarTodayRoundedIcon fontSize="small" /> },
  { label: "Пациенты", to: Paths.doctorPatients, icon: <GroupRoundedIcon fontSize="small" /> },
  { label: "Записи", to: Paths.doctorRecords, icon: <DescriptionRoundedIcon fontSize="small" /> },
  { label: "Коды приглашения", to: Paths.doctorInvites, icon: <KeyRoundedIcon fontSize="small" /> },
  { label: "Чат", to: Paths.doctorChat, icon: <ChatBubbleOutlineRoundedIcon fontSize="small" /> },
];

const adminNavItems = [
  { label: "Администрирование", to: Paths.adminHome, icon: <DashboardRoundedIcon fontSize="small" /> },
  { label: "Пользователи", to: Paths.adminUsers, icon: <GroupRoundedIcon fontSize="small" /> },
  { label: "Роли", to: Paths.adminRoles, icon: <SettingsRoundedIcon fontSize="small" /> },
  { label: "Участники", to: Paths.adminMemberships, icon: <PersonRoundedIcon fontSize="small" /> },
  { label: "Контекст", to: Paths.adminContext, icon: <DescriptionRoundedIcon fontSize="small" /> },
];

type AppLayoutProps = {
  variant?: "patient" | "dashboard";
};

export default function AppLayout({ variant = "dashboard" }: AppLayoutProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isAdmin = isAdminUser(user);
  const isDoctor = isDoctorUser(user);

  const resolvedNavItems = React.useMemo(() => {
    if (variant === "patient") {
      return patientNavItems;
    }

    if (isAdmin) {
      return adminNavItems;
    }

    if (isDoctor) {
      return doctorNavItems;
    }

    return patientNavItems;
  }, [isAdmin, isDoctor, variant]);

  const handleSignOut = async () => {
    await signOut();
    navigate(Paths.login, { replace: true });
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  };

  const isRouteActive = (itemTo: string) => location.pathname === itemTo || location.pathname.startsWith(`${itemTo}/`);

  const drawerContent = (
    <>
      <Box
        sx={{
          height: { xs: 68, md: 74 },
          px: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexShrink: 0,
        }}
      >
        <Box component="img" src={logoVitaentFull} alt="Vitaent" sx={{ display: "block", width: 148, height: 32 }} />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        {resolvedNavItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={isRouteActive(item.to)}
            onClick={handleNavClick}
            sx={{
              gap: 1.5,
              py: 1.5,
              px: 1.5,
              borderRadius: "12px",
              color: "text.secondary",
              minWidth: 0,
              "& .MuiListItemText-primary": {
                color: "text.secondary",
              },
              "& .nav-icon": {
                color: "text.secondary",
                flexShrink: 0,
              },
              "&.Mui-selected": {
                bgcolor: "#F5F5F7",
              },
              "&.Mui-selected .MuiListItemText-primary, &.Mui-selected .nav-icon": {
                color: "primary.main",
              },
              "&.Mui-selected:hover .MuiListItemText-primary, &.Mui-selected:hover .nav-icon": {
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
                noWrap: true,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        bgcolor: "background.default",
        overflowX: "hidden",
      }}
    >
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
        <Toolbar sx={{ minHeight: appBarOffset, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: contentColumnMaxWidth,
              mx: "auto",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {!isDesktop ? (
              <IconButton onClick={handleDrawerToggle} sx={{ mr: 0.5, flexShrink: 0 }} aria-label="Открыть меню навигации">
                <MenuRoundedIcon />
              </IconButton>
            ) : null}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }} noWrap>
                {user?.tenantSlug ?? "Клиника не выбрана"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, ml: "auto", flexShrink: 0 }}>
              <IconButton aria-label="Профиль" size="small" sx={{ color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "transparent" } }}>
                <PersonRoundedIcon fontSize="small" />
              </IconButton>
              <Button
                variant="outlined"
                onClick={handleSignOut}
                sx={{
                  minWidth: 0,
                  px: 2,
                  height: 36,
                  borderWidth: 1,
                  borderColor: "primary.main",
                  color: "text.secondary",
                  textTransform: "none",
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

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Навигация боковой панели">
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
              pt: 2,
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
              pt: 2,
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
          pb: { xs: 2, md: 3 },
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
