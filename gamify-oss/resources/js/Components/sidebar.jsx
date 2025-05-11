import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {
  Box,
  Typography,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";

import {
  BoltRounded as BoltRoundedIcon,
  ExploreRounded as ExploreRoundedIcon,
  MapRounded as MapRoundedIcon,
  LightbulbRounded as LightbulbRoundedIcon,
  FlagRounded as FlagRoundedIcon,
  HistoryRounded as HistoryRoundedIcon,
  StarRounded as StarRoundedIcon,
  EmojiEventsRounded as EmojiEventsRoundedIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LeaderboardRounded as LeaderboardRoundedIcon,
  RoomServiceRounded as RoomServiceRoundedIcon,
  Close as CloseIcon
} from "@mui/icons-material";

import { router } from "@inertiajs/react";
import AvatarProfile from "./AvatarProfile";

export default function Sidebar({ 
  username = "username", 
  width = 275, 
  role, 
  avatar = '',
  mobileOpen = false,
  onMobileClose
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { url } = usePage();
  const { user } = usePage().props.auth;

  // Level thresholds for XP progress calculation
  const levelThresholds = {
    1: 0,
    2: 200,
    3: 450,
    4: 750,
    5: 1100,
    6: 1500,
    7: 1950,
    8: 2450,
    9: 3050,
    10: 3650
  };

  // Calculate current level based on XP - this will update dynamically when XP changes
  const determineLevel = (xp) => {
    // Start from the highest level and work backwards
    for (let level = 10; level > 1; level--) {
      if (xp >= levelThresholds[level]) {
        return level;
      }
    }
    return 1; // Default to level 1
  };

  // Calculate the current level based on XP
  const calculatedLevel = determineLevel(parseInt(user.xp_point));

  const isAdmin = role === "admin";
  const isQuestPage = ["/questboard", "/beginnerquests", "/takenquests", "/questhistory"].includes(url);
  const [openQuests, setOpenQuests] = useState(isQuestPage);

  useEffect(() => {
    setOpenQuests(isQuestPage);
  }, [url]);

  const handleToggleQuests = () => {
    setOpenQuests(!openQuests);
  };

  // Calculate XP progress percentage for the current level
  const calculateXpProgress = () => {
    // Use calculated level instead of user.level
    const currentLevel = calculatedLevel;
    const currentXP = parseInt(user.xp_point);

    // If at max level, show 100%
    if (currentLevel >= 10) {
      return 100;
    }

    // Get XP thresholds for current and next level
    const nextLevel = currentLevel + 1;
    const xpForCurrentLevel = levelThresholds[currentLevel];
    const xpForNextLevel = levelThresholds[nextLevel];

    // Calculate progress percentage
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = currentXP - xpForCurrentLevel;

    return Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));
  };

  // Function to check if the current path matches a given href
  const isActive = (href) => {
    // For profile.edit route, handle separately since it doesn't match URL exactly
    if (href === route("profile.edit") && url.includes("/profile/edit")) {
      return true;
    }
    if (href === route("profile.show") && url.includes("/profile") && !url.includes("/profile/edit")) {
      return true;
    }
    return url === href || url.startsWith(href);
  };

  // Active style for menu items
  const activeStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.15)',
    borderLeft: '4px solid',
    borderColor: theme.palette.primary.main,
    paddingLeft: (theme) => theme.spacing(2) - 4, // Adjust padding to maintain alignment
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.2)',
    }
  };

  // Active style for nested menu items
  const activeNestedStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.15)',
    borderLeft: '4px solid',
    borderColor: theme.palette.primary.main,
    paddingLeft: (theme) => theme.spacing(4) - 4, // Adjust padding to maintain alignment
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.2)',
    }
  };

  // Sidebar content
  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#2f2f2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        mt: 3,
        pt: isMobile ? 2 : 7,
        overflowX: "hidden"
      }}
    >
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 2 }}>
          <IconButton 
            onClick={onMobileClose} 
            sx={{ color: 'white' }}
            aria-label="close sidebar"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Box>
        {/* Avatar */}
        <Box>
          <AvatarProfile
            src={avatar}
            alt="User Avatar"
            userId={user.user_id}
            frameSrc={user.avatar_frame_path || "/images/avatar-frames/default-frame.svg"}
            size={100}
            frameSize={130}
          />
        </Box>
      </Box>

      {/* Username */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
        {username}
      </Typography>

      {/* XP, Progress Bar, and Level Section */}
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", mb: 2 }}>
        <BoltRoundedIcon sx={{ color: "#FFC107", mr: 0.5, fontSize: 38 }} />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "left", mr: 2, width: "100%", gap: 0.25 }}>
          <Typography variant="body2">{user.xp_point} XP</Typography>
          <LinearProgress
            variant="determinate"
            value={calculateXpProgress()}
            sx={{
              borderRadius: 4,
              flexGrow: 1
            }}
          />
          <Typography variant="body2" sx={{ color: theme.palette.primary.light, fontWeight: "bold" }}>
            {calculatedLevel >= 10 ? "MAX Level" : `Level ${calculatedLevel}`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: "100%", mb: 1, bgcolor: "rgba(255,255,255,0.2)" }} />

      {/* Navigation Menu - This section should be scrollable */}
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#2f2f2f",
          },
        }}
      >
        <List className="sidebar" sx={{ width: "100%", alignItems: "left" }} component="nav">
          {/* Receptionist */}
          {isAdmin && (
            <ListItemButton 
              href="/receptionist"
              onClick={isMobile ? onMobileClose : undefined}
              sx={isActive("/receptionist") ? activeStyle : {}}
            >
              <ListItemIcon>
                <RoomServiceRoundedIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Receptionist" />
            </ListItemButton>
          )}

          {/* Quest Dropdown */}
          <ListItemButton 
            onClick={handleToggleQuests}
            sx={isQuestPage ? activeStyle : {}}
          >
            <ListItemIcon>
              <ExploreRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Quests" />
            {openQuests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>

          <Collapse in={openQuests} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton 
                href="/questboard" 
                sx={[
                  { pl: 4 },
                  isActive("/questboard") && activeNestedStyle
                ]}
                onClick={isMobile ? onMobileClose : undefined}
              >
                <ListItemIcon>
                  <MapRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Quest Board" />
              </ListItemButton>
              <ListItemButton 
                href="/beginnerquests" 
                sx={[
                  { pl: 4 },
                  isActive("/beginnerquests") && activeNestedStyle
                ]}
                onClick={isMobile ? onMobileClose : undefined}
              >
                <ListItemIcon>
                  <LightbulbRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Beginner Quests" />
              </ListItemButton>
              <ListItemButton 
                href="/takenquests" 
                sx={[
                  { pl: 4 },
                  isActive("/takenquests") && activeNestedStyle
                ]}
                onClick={isMobile ? onMobileClose : undefined}
              >
                <ListItemIcon>
                  <FlagRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Taken Quests" />
              </ListItemButton>
              <ListItemButton 
                href="/questhistory" 
                sx={[
                  { pl: 4 },
                  isActive("/questhistory") && activeNestedStyle
                ]}
                onClick={isMobile ? onMobileClose : undefined}
              >
                <ListItemIcon>
                  <HistoryRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Quest History" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton 
            href="/leaderboard"
            onClick={isMobile ? onMobileClose : undefined}
            sx={isActive("/leaderboard") ? activeStyle : {}}
          >
            <ListItemIcon>
              <LeaderboardRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Leaderboard" />
          </ListItemButton>

          <ListItemButton 
            href="/achievements"
            onClick={isMobile ? onMobileClose : undefined}
            sx={isActive("/achievements") ? activeStyle : {}}
          >
            <ListItemIcon>
              <StarRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Achievements" />
          </ListItemButton>

          <ListItemButton 
            href="/badges"
            onClick={isMobile ? onMobileClose : undefined}
            sx={isActive("/badges") ? activeStyle : {}}
          >
            <ListItemIcon>
              <EmojiEventsRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Badges" />
          </ListItemButton>
        </List>
      </Box>

      {/* Settings & Log Out */}
      <Divider sx={{ width: "100%", mt: 1, mb: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
      <List className="sidebar" sx={{ width: "100%", mb: 3 }}>
        <ListItemButton 
          href={route("profile.edit")}
          onClick={isMobile ? onMobileClose : undefined}
          sx={isActive(route("profile.edit")) ? activeStyle : {}}
        >
          <ListItemIcon>
            <SettingsIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => {
            if (isMobile) onMobileClose();
            router.post(route("logout"));
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: theme.palette.warning.main }} />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.warning.main }} primary="Log Out" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      {/* Permanent sidebar for desktop */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: { sm: width },
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              width: width,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: width,
                boxSizing: 'border-box',
                border: 'none'
              },
            }}
            open
          >
            {sidebarContent}
          </Drawer>
        </Box>
      )}

      {/* Temporary sidebar for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: width,
              boxSizing: 'border-box',
              border: 'none'
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </>
  );
}