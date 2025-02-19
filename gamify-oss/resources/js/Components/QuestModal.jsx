import React from "react";
import { Modal, Box, Typography, Chip, Button } from "@mui/material";
import { blue, green, orange, red, yellow } from "@mui/material/colors";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

export default function QuestModal({ open, onClose, quest }) {
  if (!quest) return null;

  const isUnlocked = quest.playerLevel >= quest.requiredLevel;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">{quest.questTitle}</Typography>
        <Chip
          label={isUnlocked ? "Unlocked" : "Locked"}
          icon={isUnlocked ? <LockOpenRoundedIcon /> : <LockRoundedIcon />}
          sx={{
            bgcolor: isUnlocked ? green[200] : red[200],
            border: `1px solid ${isUnlocked ? green[800] : red[800]}`,
            fontWeight: "bold",
            color: "black",
            my: 1,
          }}
        />
        <Typography variant="body2" color="text.secondary" my={2}>
          {quest.questDescription}
        </Typography>
        <Chip
          label={`XP +${quest.xpReward}`}
          sx={{ bgcolor: yellow[200], border: `1px solid ${yellow[800]}`, fontWeight: "bold", mr: 1 }}
        />
        <Chip
          label={`${quest.role} Proficiency +${quest.proficiencyReward}`}
          sx={{ bgcolor: blue[100], border: `1px solid ${blue[800]}`, fontWeight: "bold" }}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
