import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import { useTheme } from '@mui/material/styles';
import AdminQuestModal from "@/Components/AdminQuestModal";
// Using native JS date formatting instead of date-fns

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
                                    label={status === "waiting" ? "Request Pending" : "Submission Pending"}
                                    sx={{
                                        bgcolor: status === "waiting" ? orange[200] : blue[200],
                                        border: status === "waiting" ? `1px solid ${orange[800]}` : `1px solid ${blue[800]}`,
                                        fontWeight: 'bold',
                                        px: 0.5,
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
                    
                    {/* Date section */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, px: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {status === "waiting" ? 
                                `Request Date: ${formatDate(requestDate)}` : 
                                `Submit Date: ${formatDate(submitDate)}`}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={status === "waiting" ? orange[800] : blue[800]}>
                            {status === "waiting" ? "Awaiting Approval" : "Awaiting Review"}
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