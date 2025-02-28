import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Button, Box } from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import { useTheme } from '@mui/material/styles';
import QuestModal from "./QuestModal";

export default function QuestCard({
    questId = 1,
    questTitle = "Quest Title",
    questDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    playerLevel = 3,
    requiredLevel = 3,
    difficulty = "Easy",
    xpReward = 75,
    role = "Game Programmer",
    proficiencyReward = 100,
    isCompleted = false,
    submissionImages = [],
}) {
    const isUnlocked = playerLevel >= requiredLevel;

    const theme = useTheme();

    const [open, setOpen] = useState(false);

    return (
        <>
            <Card sx={{
                display: "flex",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                my: 2,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                },
            }}
                onClick={() => setOpen(true)}
            >
                <CardContent sx={{
                    flexGrow: 1,
                    alignItems: 'center',
                }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box mx={1}>
                            <Typography variant="h6" fontWeight="bold">
                                {questTitle}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} my={1}>
                                {isCompleted ? (
                                    <Chip
                                        label="Completed"
                                        sx={{
                                            bgcolor: "transparent",
                                            border: '1px solid ' + grey[700],
                                            fontWeight: 'bold',
                                            color: grey[800],
                                            px: 0.5,
                                        }}
                                    />
                                ) : (
                                    <Chip
                                        label={isUnlocked ? "Unlocked" : "Locked"}
                                        icon={isUnlocked ? <LockOpenRoundedIcon /> : <LockRoundedIcon />}
                                        sx={{
                                            bgcolor: isUnlocked ? green[200] : red[200],
                                            border: isUnlocked ? '1px solid' + green[800] : '1px solid' + red[800],
                                            fontWeight: 'bold',
                                            color: 'black',
                                            px: 0.5,
                                            '& .MuiChip-icon': {
                                                color: 'black'
                                            },
                                        }}
                                    />
                                )}
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
                                    WebkitLineClamp: 1,
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
                            alignItems: 'flex-end'
                        }}>
                            <Box sx={{
                                gap: 1,
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                                <Chip
                                    label={difficulty}
                                    sx={{
                                        bgcolor: difficulty === "Easy" ? green[200] : difficulty === "Medium" ? orange[200] : red[200],
                                        border: difficulty === "Easy" ? '1px solid' + green[800] : difficulty === "Medium" ? '1px solid' + orange[800] : '1px solid' + red[800],
                                        fontWeight: 'bold',
                                    }}
                                />
                                <Chip
                                    label={`XP +${xpReward}`}
                                    sx={{
                                        bgcolor: yellow[200],
                                        border: '1px solid' + yellow[800],
                                        fontWeight: 'bold',
                                    }}
                                />
                            </Box>
                            {proficiencyReward > 0 && (
                                <Chip
                                    label={`${role} Proficiency +${proficiencyReward}`}
                                    sx={{
                                        bgcolor: blue[100],
                                        border: '1px solid' + blue[800],
                                        fontWeight: 'bold',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </CardContent>
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: 0,
                        minWidth: 50,
                        backgroundColor: isCompleted ? grey[600] : isUnlocked ? theme.palette.primary.main : grey[400]
                    }}
                    disabled={!isUnlocked || isCompleted}
                >
                    <KeyboardDoubleArrowRightRoundedIcon sx={{ color: 'white' }} />
                </Button>
            </Card>
            <QuestModal 
                open={open} 
                onClose={() => setOpen(false)} 
                quest={{ 
                    questId,
                    questTitle, 
                    questDescription, 
                    playerLevel, 
                    requiredLevel, 
                    difficulty, 
                    xpReward, 
                    role, 
                    proficiencyReward,
                    isCompleted,
                    submissionImages
                }} 
            />
        </>
    );
}