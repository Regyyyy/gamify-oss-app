import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Button, Box } from "@mui/material";
import { blue, green, grey, orange, red, yellow, purple } from "@mui/material/colors";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
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
    isTaken = false,
    submissionImages = [],
    issueLink = null,
    teammates = [],
    questType = "Beginner", // New prop for quest type
    currentUserAvatar = null,
    status = "open",
}) {
    const isUnlocked = playerLevel >= requiredLevel;

    const theme = useTheme();

    const [open, setOpen] = useState(false);
    
    // Determine the actual status based on quest type and completion
    const determineStatus = () => {
        // For Beginner quests, use isCompleted to determine status
        if (questType === "Beginner") {
            return isCompleted ? "finished" : "open";
        }
        // For Advanced quests, use the provided status
        return status;
    };

    const actualStatus = determineStatus();

    // Function to determine chip properties based on status
    const getStatusChip = () => {
        switch (actualStatus) {
            case "open":
                return {
                    label: isUnlocked ? "Unlocked" : "Locked",
                    icon: isUnlocked ? <LockOpenRoundedIcon /> : <LockRoundedIcon />,
                    bgcolor: isUnlocked ? green[200] : red[200],
                    border: isUnlocked ? `1px solid ${green[800]}` : `1px solid ${red[800]}`,
                    color: 'black'
                };
            case "waiting":
                return {
                    label: "Waiting",
                    bgcolor: orange[200],
                    border: `1px solid ${orange[800]}`,
                    color: 'black'
                };
            case "in progress":
                return {
                    label: "In Progress",
                    icon: <HistoryIcon />,
                    bgcolor: blue[200],
                    border: `1px solid ${blue[800]}`,
                    color: 'black'
                };
            case "submitted":
                return {
                    label: "Reviewing",
                    icon: <RateReviewIcon />,
                    bgcolor: purple[200],
                    border: `1px solid ${purple[800]}`,
                    color: 'black'
                };
            case "finished":
                return {
                    label: "Finished",
                    icon: <CheckCircleIcon />,
                    bgcolor: "transparent",
                    border: `1px solid ${grey[700]}`,
                    color: grey[800]
                };
            default:
                return {
                    label: "Unknown",
                    bgcolor: grey[200],
                    border: `1px solid ${grey[800]}`,
                    color: 'black'
                };
        }
    };

    const statusChip = getStatusChip();

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
                                <Chip
                                    label={statusChip.label}
                                    icon={statusChip.icon}
                                    sx={{
                                        bgcolor: statusChip.bgcolor,
                                        border: statusChip.border,
                                        fontWeight: 'bold',
                                        color: statusChip.color,
                                        px: 0.5,
                                        '& .MuiChip-icon': {
                                            color: statusChip.color
                                        },
                                    }}
                                />
                                {actualStatus === "open" && !isCompleted && !isTaken && (
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {`Required Level ${requiredLevel}`}
                                    </Typography>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 1,
                                    overflow: "hidden",
                                }}
                            >
                                <Typography>
                                    {questDescription}
                                </Typography>
                            </Box>
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
                        backgroundColor: 
                            actualStatus === "finished" ? grey[600] :
                            actualStatus === "submitted" ? purple[600] :
                            actualStatus === "in progress" ? blue[600] :
                            actualStatus === "waiting" ? orange[600] :
                            isUnlocked ? theme.palette.primary.main : grey[400]
                    }}
                    disabled={!isUnlocked || actualStatus !== "open"} // Only enable for open quests that are unlocked
                >
                    <KeyboardDoubleArrowRightRoundedIcon sx={{ color: 'white' }} />
                </Button>
            </Card>
            <QuestModal 
                open={open} 
                onClose={() => setOpen(false)}
                questType={questType}
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
                    isCompleted: status === "finished",
                    is_taken: isTaken,
                    submissionImages,
                    issue_link: issueLink,
                    teammates,
                    currentUserAvatar,
                    status,
                }} 
            />
        </>
    );
}