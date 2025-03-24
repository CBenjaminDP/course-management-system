import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Collapse } from '@mui/material';
import { useRouter } from 'next/navigation';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { MENU_OPTIONS } from '../../constants';

const Sidebar = ({ rol }) => {
  const router = useRouter();
  const [openSubMenus, setOpenSubMenus] = useState({});
  const menuItems = MENU_OPTIONS[rol] || [];

  const handleSubMenu = (index) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleNavigate = (url) => {
    router.push(url);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)',
          bgcolor: 'white',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: 'none'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <Box key={index}>
              <ListItemButton
                onClick={() => item.subPages ? handleSubMenu(index) : handleNavigate(item.url)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500
                    }
                  }}
                />
                {item.subPages && (openSubMenus[index] ? <ExpandLess /> : <ExpandMore />)}
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
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <ListItemText 
                          primary={subItem.label}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '0.9rem',
                              color: 'text.secondary'
                            }
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