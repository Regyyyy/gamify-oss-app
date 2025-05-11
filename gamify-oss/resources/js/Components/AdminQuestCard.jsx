import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { blue, green, grey, orange, purple, red, yellow } from "@mui/material/colors";
import { useTheme } from '@mui/material/styles';
import AdminQuestModal from "@/Components/AdminQuestModal";
import HistoryIcon from '@mui/icons-material/History';
import RateReviewIcon from '@mui/icons-material/RateReview';

export default function AdminQuestCard({
    questId = 1,
    questTitle = "Quest Title",
    questDescription = "Quest Description",
    difficulty = "Easy",
    xpReward = 75,
    role = "Game Programmer",
    proficiencyReward = 100,
    status = "waiting",
    requestDate = null,
    submitDate = null,
    submissionImages = [],
    issueLink = null,
    teammates = [],
    currentUserAvatar = null,
}) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    // Format date from database format (2025-03-04 19:35:59) to website format (4 Mar 2025)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Get status chip props based on status
    const getStatusChip = () => {
        switch(status) {
            case "waiting":
                return {
                    label: "Request Pending",
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
            default:
                return {
                    label: "Unknown Status",
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
                    width: '100%'
                }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box mx={1} sx={{ flexGrow: 1 }}>
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
                                        px: 0.5,
                                        '& .MuiChip-icon': {
                                            color: statusChip.color
                                        },
                                    }}
                                />
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
                                        border: difficulty === "Easy" ? `1px solid ${green[800]}` : difficulty === "Medium" ? `1px solid ${orange[800]}` : `1px solid ${red[800]}`,
                                        fontWeight: 'bold',
                                    }}
                                />
                                <Chip
                                    label={`XP +${xpReward}`}
                                    sx={{
                                        bgcolor: yellow[200],
                                        border: `1px solid ${yellow[800]}`,
                                        fontWeight: 'bold',
                                    }}
                                />
                            </Box>
                            {proficiencyReward > 0 && (
                                <Chip
                                    label={`${role} Proficiency +${proficiencyReward}`}
                                    sx={{
                                        bgcolor: blue[100],
                                        border: `1px solid ${blue[800]}`,
                                        fontWeight: 'bold',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                    
                    {/* Date section - different labels based on status */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, px: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {status === "waiting" ? 
                                `Request Date: ${formatDate(requestDate)}` : 
                                status === "submitted" ?
                                    `Submit Date: ${formatDate(submitDate)}` :
                                    `Start Date: ${formatDate(requestDate || submitDate)}`}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" 
                            color={status === "waiting" ? 
                                orange[800] : 
                                status === "in progress" ? 
                                    blue[800] : 
                                    purple[800]}>
                            {status === "waiting" ? 
                                "Awaiting Approval" : 
                                status === "in progress" ?
                                    "In Progress" :
                                    "Awaiting Review"}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
            <AdminQuestModal 
                open={open} 
                onClose={() => setOpen(false)}
                quest={{ 
                    questId,
                    questTitle, 
                    questDescription, 
                    difficulty, 
                    xpReward, 
                    role, 
                    proficiencyReward,
                    status,
                    requestDate,
                    submitDate,
                    submissionImages,
                    issue_link: issueLink,
                    teammates,
                    currentUserAvatar
                }} 
            />
        </>
    );
}