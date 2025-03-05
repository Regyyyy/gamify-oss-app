import React from "react";
import { Modal, Box, Typography, Chip, IconButton, Paper, Link, Button } from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
// Using native JS date formatting instead of date-fns

export default function AdminQuestModal({ open, onClose, quest }) {
    if (!quest) return null;

    const { status, submissionImages = [], teammates = [] } = quest;

    const { post, processing } = useForm();

    // Format date from database format (2025-03-04 19:35:59) to website format (4 Mar 2025)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleAction = (action) => {
        post(route('admin.quest.action'), {
            quest_id: quest.questId,
            action: action
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    // Render submission images if available
    const renderSubmissionImages = () => {
        if (!submissionImages || submissionImages.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    No submission images available.
                </Typography>
            );
        }

        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
                {submissionImages.map((image, index) => (
                    <Paper
                        key={index}
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={`/storage/${image}`}
                            alt={`Submission ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "auto",
                                maxHeight: "200px",
                                objectFit: "contain",
                                marginBottom: "8px"
                            }}
                        />
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => window.open(`/storage/${image}`, '_blank')}
                            sx={{ mt: 1 }}
                        >
                            View Full Size
                        </Button>
                    </Paper>
                ))}
            </Box>
        );
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 1100,
                    maxHeight: "90vh",
                    overflow: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    pt: 5, // Add extra padding at top for the close button
                    borderRadius: 2,
                }}
            >
                {/* Close button (X) in the top-right corner */}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    disabled={processing}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                    {/* Left side - Quest Information */}
                    <Box sx={{ flex: { md: 7 / 12 } }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {quest.questTitle}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <Chip
                                label={status === "waiting" ? "Request Pending" : "Submission Pending"}
                                sx={{
                                    bgcolor: status === "waiting" ? orange[200] : blue[200],
                                    border: status === "waiting" ? `1px solid ${orange[800]}` : `1px solid ${blue[800]}`,
                                    fontWeight: 'bold',
                                    px: 0.5,
                                }}
                            />
                            <Typography variant="body2" fontWeight="bold">
                                {status === "waiting" 
                                    ? `Requested on: ${formatDate(quest.requestDate)}` 
                                    : `Submitted on: ${formatDate(quest.submitDate)}`}
                            </Typography>
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                {quest.questDescription}
                            </Typography>
                        </Box>

                        {quest.issue_link && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <strong>Read More: </strong>
                                    <Link
                                        href={quest.issue_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            wordBreak: 'break-word',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            ml: 1
                                        }}
                                    >
                                        {quest.issue_link}
                                    </Link>
                                </Typography>
                            </Box>
                        )}

                        {/* Submission Images - Only show if status is submitted */}
                        {status !== "waiting" && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Submitted Work
                                </Typography>
                                {renderSubmissionImages()}
                            </Box>
                        )}
                    </Box>

                    {/* Right side - Team and Actions */}
                    <Box sx={{ flex: { md: 5 / 12 } }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Rewards & Details
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                                    <Chip
                                        label={quest.difficulty}
                                        sx={{
                                            bgcolor: quest.difficulty === "Easy" ? green[200] : quest.difficulty === "Medium" ? orange[200] : red[200],
                                            border: quest.difficulty === "Easy" ? `1px solid ${green[800]}` : quest.difficulty === "Medium" ? `1px solid ${orange[800]}` : `1px solid ${red[800]}`,
                                            fontWeight: "bold",
                                        }}
                                    />
                                    <Chip
                                        label={`XP +${quest.xpReward}`}
                                        sx={{
                                            bgcolor: yellow[200],
                                            border: `1px solid ${yellow[800]}`,
                                            fontWeight: "bold",
                                        }}
                                    />
                                    {quest.proficiencyReward > 0 && (
                                        <Chip
                                            label={`${quest.role} Proficiency +${quest.proficiencyReward}`}
                                            sx={{
                                                bgcolor: blue[100],
                                                border: `1px solid ${blue[800]}`,
                                                fontWeight: "bold",
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            {/* Team Members */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Team Members
                                </Typography>
                                
                                {teammates && teammates.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {teammates.map(member => (
                                            <Box 
                                                key={member.user_id} 
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'rgba(0, 0, 0, 0.03)'
                                                }}
                                            >
                                                <Avatar
                                                    src={member.avatar ? `/storage/${member.avatar}` : "/default-avatar.png"}
                                                    alt={member.name}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle2">{member.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Level {member.level}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No team members found.
                                    </Typography>
                                )}
                            </Box>

                            {/* Admin Actions */}
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Admin Actions
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {status === "waiting" 
                                        ? "Approve or decline this quest request." 
                                        : "Accept or decline this quest submission."}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <PrimaryButton
                                        fullWidth
                                        disabled={processing}
                                        onClick={() => handleAction('decline')}
                                        startIcon={<CloseIcon />}
                                        sx={{ 
                                            backgroundColor: red[600],
                                            '&:hover': {
                                                backgroundColor: red[800],
                                            }
                                        }}
                                    >
                                        Decline
                                    </PrimaryButton>
                                    
                                    <PrimaryButton
                                        fullWidth
                                        disabled={processing}
                                        onClick={() => handleAction('accept')}
                                        startIcon={<CheckIcon />}
                                        sx={{ 
                                            backgroundColor: green[600],
                                            '&:hover': {
                                                backgroundColor: green[800],
                                            }
                                        }}
                                    >
                                        Accept
                                    </PrimaryButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}