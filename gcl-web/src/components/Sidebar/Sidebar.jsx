import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { MENU_OPTIONS } from "../../constants";

// Define theme colors to match login
const theme = {
  primary: "#FFD700", // Gold
  secondary: "#4A4A4A",
  text: "#333333",
  hover: "#E6C200",
  background: "#f8f9fa",
};

const Sidebar = ({ rol, isMobile, mobileOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState({});
  const menuItems = MENU_OPTIONS[rol] || [];

  // Initialize open submenus based on current path
  useEffect(() => {
    const newOpenSubMenus = {};
    menuItems.forEach((item, index) => {
      if (item.subPages) {
        const isSubPageActive = item.subPages.some(
          (subPage) => pathname === subPage.url
        );
        if (isSubPageActive) {
          newOpenSubMenus[index] = true;
        }
      }
    });
    setOpenSubMenus(newOpenSubMenus);
  }, [pathname, menuItems]);

  const handleSubMenu = (index) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavigate = (url) => {
    router.push(url);
    if (isMobile) {
      onClose(); // Close drawer when navigating on mobile
    }
  };

  // Function to check if a menu item is active
  const isMenuItemActive = (item) => {
    if (item.url === pathname) return true;
    if (item.subPages) {
      return item.subPages.some((subPage) => subPage.url === pathname);
    }
    return false;
  };

  const drawerContent = (
    <Box sx={{ width: 240, pt: isMobile ? 0 : 8, overflowY: 'auto', height: '100%' }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      {/* Only show logo in sidebar on mobile */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              height: "40px",
              width: "auto",
            }}
          />
        </Box>
      )}
      {isMobile && <Divider />}
      <List component="nav" sx={{ pt: 1 }}>
        {menuItems.map((item, index) => (
          <Box key={index}>
            {item.subPages ? (
              <>
                <ListItemButton
                  onClick={() => handleSubMenu(index)}
                  sx={{
                    backgroundColor: isMenuItemActive(item)
                      ? "rgba(255, 215, 0, 0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                    },
                    borderLeft: isMenuItemActive(item)
                      ? `4px solid ${theme.primary}`
                      : "4px solid transparent",
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isMenuItemActive(item) ? 600 : 400,
                        color: isMenuItemActive(item)
                          ? theme.secondary
                          : "inherit",
                      },
                    }}
                  />
                  {openSubMenus[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={openSubMenus[index]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subPages.map((subPage, subIndex) => (
                      <ListItemButton
                        key={subIndex}
                        onClick={() => handleNavigate(subPage.url)}
                        sx={{
                          pl: 4,
                          backgroundColor:
                            pathname === subPage.url
                              ? "rgba(255, 215, 0, 0.1)"
                              : "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(255, 215, 0, 0.1)",
                          },
                          borderLeft:
                            pathname === subPage.url
                              ? `4px solid ${theme.primary}`
                              : "4px solid transparent",
                        }}
                      >
                        <ListItemText
                          primary={subPage.label}
                          sx={{
                            "& .MuiTypography-root": {
                              fontWeight: pathname === subPage.url ? 600 : 400,
                              color:
                                pathname === subPage.url
                                  ? theme.secondary
                                  : "inherit",
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                onClick={() => handleNavigate(item.url)}
                sx={{
                  backgroundColor: pathname === item.url
                    ? "rgba(255, 215, 0, 0.1)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                  },
                  borderLeft: pathname === item.url
                    ? `4px solid ${theme.primary}`
                    : "4px solid transparent",
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: pathname === item.url ? 600 : 400,
                      color: pathname === item.url ? theme.secondary : "inherit",
                    },
                  }}
                />
              </ListItemButton>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: 240,
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          height: '100%',
          zIndex: 1400
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: 'white',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
