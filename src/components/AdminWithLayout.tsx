"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  AccountCircle,
  Dashboard,
  Group,
  InsertDriveFile,
  MenuOpen,
  Person,
  PersonAdd,
} from "@mui/icons-material";

const drawerWidth = 240; // ตอน open
const miniWidth = 64; // ตอน close
const basePath = "/admin";
const menuItems = [
  { label: "Dashboard", path: `${basePath}/dashboard`, icon: <Dashboard /> },
  { label: "แบบสอบถาม", path: `${basePath}/forms`, icon: <InsertDriveFile /> },
  { label: "ผู้ใช้งาน", path: `${basePath}/users`, icon: <Group /> },
];

export default function AdminWithLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
    setMobileOpen(!mobileOpen);
  };

  // Sidebar
  const drawer = (
    <div>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path}>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname.startsWith(item.path)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <CssBaseline />
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "64px",
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => {
              handleDrawerToggle();
            }}
            sx={{ mr: 2, color: "white" }}
          >
            {menuOpen ? <MenuOpen /> : <MenuIcon />}
          </IconButton>
          <Image
            src="/images/contact-form.png"
            alt="Logo"
            width={40}
            height={40}
            style={{ marginRight: 16 }}
          />
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Siam Centric Research
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              sx={{ p: 0 }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ mt: 1 }}
              PaperProps={{ style: { width: 200 } }}
            >
              {/* Header ของเมนู */}
              <Box sx={{ px: 2, py: 1 }}>
                <Typography fontWeight="bold">System Owner</Typography>
                <Typography variant="body2" color="text.secondary">
                  superadmin
                </Typography>
              </Box>
              <Divider
                sx={{
                  mb: 1,
                }}
              />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Create Account" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>ออกจากระบบ</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {/* Content area below header */}
      {/* <Toolbar /> */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar - Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Sidebar - Desktop */}
        <Drawer
          variant="permanent"
          open={menuOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: menuOpen ? drawerWidth : miniWidth,
              top: "64px",
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }),
            },
          }}
        >
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={pathname.startsWith(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: menuOpen ? "initial" : "center",
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: menuOpen ? 2 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {/* โชว์เฉพาะตอน open */}
                  {menuOpen && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: "64px",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#f9f9f9",
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            width: "100%",
            // width: {
            //   md: `calc(100% - ${menuOpen ? drawerWidth : miniWidth}px)`,
            // },
            ml: { md: `${menuOpen ? drawerWidth : miniWidth}px` },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
