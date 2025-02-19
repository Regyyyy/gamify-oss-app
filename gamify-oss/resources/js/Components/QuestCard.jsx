import React from "react";
import { Card, CardContent, Typography, Chip, Button, Box } from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';

export default function QuestCard({
    questTitle = "Quest Title",
    questDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    playerLevel = 3,
    requiredLevel = 3,
    difficulty = "Easy",
    xpReward = 75,
    role = "Game Programmer",
    proficiencyReward = 100,
}) {
    const isUnlocked = playerLevel >= requiredLevel;

    return (
        <Card sx={{ display: "flex", borderRadius: 2, overflow: "hidden", boxShadow: 3, my: 2 }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {questTitle}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} my={1}>
                            <Chip
                                label={isUnlocked ? "Unlocked" : "Locked"}
                                icon={isUnlocked ? <LockOpenRoundedIcon /> : <LockRoundedIcon />}
                                sx={{
                                    bgcolor: isUnlocked ? green[200] : red[200],
                                    border: isUnlocked ? '1px solid green' : '1px solid red',
                                    fontWeight: 'bold',
                                    color: 'black',
                                    px: 0.5,
                                    '& .MuiChip-icon': {
                                        color: 'black'
                                    },
                                }}
                            />
                            <Typography variant="subtitle2" fontWeight="bold">
                                Required Level {requiredLevel}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1, // Limit to 2 lines
                                overflow: "hidden",
                            }}
                        >
                            {questDescription}
                        </Typography>
                    </Box>
                    <Box sx={{
                        ml: 2,
                        mt: 1,
                        gap: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'right'
                    }}>
                        <Box sx={{
                            alignItems: 'right',
                            gap: 1,
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                            <Chip
                                label={difficulty}
                                sx={{
                                    bgcolor: difficulty === "Easy" ? green[200] : difficulty === "Medium" ? orange[200] : red[200],
                                    border: difficulty === "Easy" ? '1px solid green' : difficulty === "Medium" ? '1px solid orange' : '1px solid red',
                                    fontWeight: 'bold',
                                }}
                            />
                            <Chip
                                label={`XP +${xpReward}`}
                                sx={{
                                    bgcolor: yellow[200],
                                    border: '1px solid yellow',
                                    fontWeight: 'bold',
                                }}
                            />
                        </Box>
                        <Chip
                            label={`${role} Proficiency +${proficiencyReward}`}
                            sx={{
                                bgcolor: blue[100],
                                border: '1px solid blue',
                                fontWeight: 'bold',
                            }}
                        />
                    </Box>
                </Box>
            </CardContent>
            <Button
                variant="contained"
                sx={{ borderRadius: 0, minWidth: 50, backgroundColor: isUnlocked ? orange[500] : grey[400] }}
                disabled={!isUnlocked}
            >
                <KeyboardDoubleArrowRightRoundedIcon sx={{ color: 'white' }} />
            </Button>
        </Card>
    );
}
