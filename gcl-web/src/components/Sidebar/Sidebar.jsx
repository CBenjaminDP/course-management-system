import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { MENU_OPTIONS } from "../../constants";

const Sidebar = ({ rol }) => {
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
  };

  // Function to check if a menu item is active
  const isMenuItemActive = (item) => {
    if (item.url === pathname) return true;
    if (item.subPages) {
      return item.subPages.some((subPage) => subPage.url === pathname);
    }
    return false;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          top: "64px",
          height: "calc(100% - 64px)",
          bgcolor: "white",
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "none",
        },
      }}
    >
      <Box sx={{ overflow: "auto", py: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <Box key={index}>
              <ListItemButton
                onClick={() =>
                  item.subPages
                    ? handleSubMenu(index)
                    : handleNavigate(item.url)
                }
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: isMenuItemActive(item) ? "rgba(0, 0, 0, 0.04)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: isMenuItemActive(item) ? "primary.main" : "inherit",
                    },
                  }}
                />
                {item.subPages &&
                  (openSubMenus[index] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {item.subPages && (
                <Collapse in={openSubMenus[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subPages.map((subItem, subIndex) => (
                      <ListItemButton
                        key={subIndex}
                        onClick={() => handleNavigate(subItem.url)}
                        sx={{
                          pl: 4,
                          mx: 1,
                          borderRadius: 1,
                          mb: 0.5,
                          bgcolor: pathname === subItem.url ? "rgba(0, 0, 0, 0.04)" : "transparent",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.label}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: "0.9rem",
                              color: pathname === subItem.url ? "primary.main" : "text.secondary",
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
