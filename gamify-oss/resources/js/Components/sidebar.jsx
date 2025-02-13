import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider
} from '@mui/material';

// Icons (install @mui/icons-material if not installed)
import BoltIcon from '@mui/icons-material/Bolt';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function Sidebar() {
  const [openQuests, setOpenQuests] = useState(false);

  const handleToggleQuests = () => {
    setOpenQuests(!openQuests);
  };

  return (
    <Box
      sx={{
        width: '250px',
        height: '100vh',
        bgcolor: '#2f2f2f',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
      }}
    >
      {/* User Avatar */}
      <Avatar
        alt="User Avatar"
        src="https://via.placeholder.com/80"
        sx={{ width: 80, height: 80, mb: 1 }}
      />

      {/* Username */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        username
      </Typography>

      {/* XP + Thunder Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <BoltIcon sx={{ color: '#FFC107', mr: 0.5 }} />
        <Typography variant="body2">2106 XP</Typography>
      </Box>

      {/* XP Bar + Level */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress variant="determinate" value={70} sx={{ mb: 0.5 }} />
        <Typography variant="body2" align="right">
          Level 3
        </Typography>
      </Box>

      {/* Quest Dropdown */}
      <List sx={{ width: '100%' }} component="nav">
        <ListItemButton onClick={handleToggleQuests}>
          <ListItemText primary="Quests" />
          {openQuests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={openQuests} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quest Board" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Beginner Quests" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Taken Quests" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quest History" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton>
          <ListItemText primary="Achievements" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Badges" />
        </ListItemButton>
      </List>

      {/* Spacer to push settings/log out to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Settings & Log Out */}
      <Divider sx={{ width: '100%', mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ width: '100%' }}>
        <ListItemButton>
          <ListItemIcon>
            <SettingsIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </List>
    </Box>
  );
}
