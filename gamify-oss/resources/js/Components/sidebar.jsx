import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
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
  RoomServiceRounded as RoomServiceRoundedIcon
} from "@mui/icons-material";

import { router } from "@inertiajs/react";
import { useTheme } from "@mui/material/styles";

export default function Sidebar({ username = "username", width = 275, role, avatar = '' }) {
  const theme = useTheme();
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

  return (
    <Box
      sx={{
        width: { width },
        height: "100vh",
        bgcolor: "#2f2f2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "fixed",
        p: 2,
        pt: 10,
      }}
    >
      {/* Avatar */}
      <Avatar alt="User Avatar" src={avatar} sx={{ width: 80, height: 80, mb: 1 }} />

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

      <List className="sidebar" sx={{ width: "100%", alignItems: "left" }} component="nav">
        {/* Receptionist */}
        {isAdmin ?
          <ListItemButton href="/receptionist">
            <ListItemIcon>
              <RoomServiceRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Receptionist" />
          </ListItemButton>
          :
          <></>
        }

        {/* Quest Dropdown */}
        <ListItemButton onClick={handleToggleQuests}>
          <ListItemIcon>
            <ExploreRoundedIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Quests" />
          {openQuests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={openQuests} timeout="auto" unmountOnExit>
          <Box
            sx={{
              maxHeight: 125,
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
            <List component="div" disablePadding>
              <ListItemButton href="/questboard" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <MapRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Quest Board" />
              </ListItemButton>
              <ListItemButton href="/beginnerquests" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LightbulbRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Beginner Quests" />
              </ListItemButton>
              <ListItemButton href="/takenquests" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <FlagRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Taken Quests" />
              </ListItemButton>
              <ListItemButton href="/questhistory" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <HistoryRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText className="sidebar" primary="Quest History" />
              </ListItemButton>
            </List>
          </Box>
        </Collapse>

        <ListItemButton href="/leaderboard">
          <ListItemIcon>
            <LeaderboardRoundedIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Leaderboard" />
        </ListItemButton>

        <ListItemButton href="/achievements">
          <ListItemIcon>
            <StarRoundedIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Achievements" />
        </ListItemButton>

        <ListItemButton href="/badges">
          <ListItemIcon>
            <EmojiEventsRoundedIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Badges" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Settings & Log Out */}
      <Divider sx={{ width: "100%", mb: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
      <List className="sidebar" sx={{ width: "100%", mb: 3 }}>
        <ListItemButton href={route("profile.edit")}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton onClick={() => router.post(route("logout"))}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: theme.palette.warning.main }} />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.warning.main }} primary="Log Out" />
        </ListItemButton>
      </List>
    </Box>
  );
}