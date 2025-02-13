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

import './../../css/app.css';

// Icons (install @mui/icons-material if not installed)
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
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
        width: '265px',
        height: '100vh',
        bgcolor: '#2f2f2f',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        pt: 12,
      }}
    >
      {/* Avatar */}
      <Avatar
        alt="User Avatar"
        src="https://via.placeholder.com/80"
        sx={{ width: 80, height: 80, mb: 1 }}
      />

      {/* Username */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        username
      </Typography>

      {/* XP, Progress Bar, and Level Section */}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', mb: 2 }}>
        <BoltRoundedIcon sx={{ color: '#FFC107', mr: 0.5, fontSize: 35, }} />
        {/* XP, Progress Bar, and Level */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', mr: 2, width: '100%', }}>
          <Typography variant="body2">2106 XP</Typography>
          <LinearProgress
            variant="determinate"
            value={70}
            sx={{ flexGrow: 1 }}
          />
          <Typography variant="body2">Level 3</Typography>
        </Box>
      </Box>

      <Divider sx={{ width: '100%', mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />

      {/* Quest Dropdown */}
      <List sx={{ width: '100%', alignItems: 'left' }} component="nav">
        <ListItemButton onClick={handleToggleQuests}>
          <ListItemIcon>
            <ExploreRoundedIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Quests" />
          {openQuests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={openQuests} timeout="auto" unmountOnExit>
          <Box sx={{ maxHeight: '120px', overflowY: 'auto' }}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <MapRoundedIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Quest Board" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LightbulbRoundedIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Beginner Quests" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <FlagRoundedIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Taken Quests" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <HistoryRoundedIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Quest History" />
              </ListItemButton>
            </List>
          </Box>
        </Collapse>

        <ListItemButton>
          <ListItemIcon>
            <StarRoundedIcon sx={{ color: '#fff'}} />
          </ListItemIcon>
          <ListItemText primary="Achievements" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <EmojiEventsRoundedIcon sx={{ color: '#fff'}} />
          </ListItemIcon>
          <ListItemText primary="Badges" />
        </ListItemButton>
      </List>

      {/* Spacer to push settings/log out to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Settings & Log Out */}
      <Divider sx={{ width: '100%', mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List className="sidebar" sx={{ width: '100%' }}>
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
