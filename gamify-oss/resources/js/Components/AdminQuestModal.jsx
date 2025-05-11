import React, { useState } from "react";
import { Modal, Box, Typography, Chip, IconButton, Paper, Link, Button, Divider, Alert } from "@mui/material";
import { blue, green, grey, orange, purple, red, yellow } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from '@mui/icons-material/History';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import AvatarProfile from "./AvatarProfile";
import SecondaryButton from "@/Components/SecondaryButton";

export default function AdminQuestModal({ open, onClose, quest }) {
    if (!quest) return null;

    const { status, submissionImages = [], teammates = [] } = quest;
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState('');

    // Format date from database format (2025-03-04 19:35:59) to website format (4 Mar 2025)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Get status chip based on status
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

    const handleOpenConfirm = (action) => {
        setConfirmAction(action);
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const handleAction = (action) => {
        console.log(`Submitting action: ${action} for quest ID: ${quest.questId}`);
        setIsProcessing(true);

        // Use router.post instead of useForm's post
        router.post(route('admin.quest.action'), {
            quest_id: quest.questId,
            action: action
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Action processed successfully');
                onClose();
                // Reload the page to show updated data
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Action failed with errors:', errors);
                setIsProcessing(false);
            },
            onFinish: () => {
                if (!window.location.reload) {
                    setIsProcessing(false);
                }
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

    // Render admin actions based on status
    const renderAdminActions = () => {
        if (status === "waiting") {
            return (
                <>
                    <Typography variant="h6" gutterBottom>
                        Admin Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Approve or decline this quest request.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled={isProcessing}
                            onClick={() => handleOpenConfirm('decline')}
                            startIcon={<CloseIcon />}
                            sx={{
                                color: red[600],
                                borderColor: red[600],
                                '&:hover': {
                                    backgroundColor: red[50],
                                    borderColor: red[800],
                                }
                            }}
                        >
                            Decline
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            disabled={isProcessing}
                            onClick={() => handleOpenConfirm('accept')}
                            startIcon={<CheckIcon />}
                            sx={{
                                color: green[600],
                                borderColor: green[600],
                                '&:hover': {
                                    backgroundColor: green[50],
                                    borderColor: green[800],
                                }
                            }}
                        >
                            Accept
                        </Button>
                    </Box>
                </>
            );
        } else if (status === "submitted") {
            return (
                <>
                    <Typography variant="h6" gutterBottom>
                        Admin Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Accept or decline this quest submission.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled={isProcessing}
                            onClick={() => handleOpenConfirm('decline')}
                            startIcon={<CloseIcon />}
                            sx={{
                                color: red[600],
                                borderColor: red[600],
                                '&:hover': {
                                    backgroundColor: red[50],
                                    borderColor: red[800],
                                }
                            }}
                        >
                            Decline
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            disabled={isProcessing}
                            onClick={() => handleOpenConfirm('accept')}
                            startIcon={<CheckIcon />}
                            sx={{
                                color: green[600],
                                borderColor: green[600],
                                '&:hover': {
                                    backgroundColor: green[50],
                                    borderColor: green[800],
                                }
                            }}
                        >
                            Accept
                        </Button>
                    </Box>
                </>
            );
        } else if (status === "in progress") {
            return (
                <>
                    <Typography variant="h6" gutterBottom>
                        Admin Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        You can cancel this quest if team members are inactive or if the quest needs to be reassigned.
                    </Typography>

                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Canceling a quest will reset it to "open" status and remove all assigned team members. This action cannot be undone.
                    </Alert>

                    <Button
                        fullWidth
                        variant="outlined"
                        disabled={isProcessing}
                        onClick={() => handleOpenConfirm('cancel')}
                        startIcon={<CancelIcon />}
                        sx={{
                            color: red[600],
                            borderColor: red[600],
                            '&:hover': {
                                backgroundColor: red[50],
                                borderColor: red[800],
                            }
                        }}
                    >
                        Cancel Quest
                    </Button>
                </>
            );
        }

        return null;
    };

    // Render confirmation dialog
    const renderConfirmationDialog = () => {
        let title, message, confirmText, confirmColor;

        if (confirmAction === 'accept') {
            title = status === "waiting" ? "Approve Quest Request?" : "Accept Quest Submission?";
            message = status === "waiting" 
                ? "Are you sure you want to approve this quest request? The team will be able to start working on it." 
                : "Are you sure you want to accept this quest submission? Team members will receive XP and proficiency rewards.";
            confirmText = "Approve";
            confirmColor = green[600];
        } else if (confirmAction === 'decline') {
            title = status === "waiting" ? "Decline Quest Request?" : "Decline Quest Submission?";
            message = "Are you sure you want to decline this? The quest will be reset to 'open' status and all team assignments will be removed.";
            confirmText = "Decline";
            confirmColor = red[600];
        } else if (confirmAction === 'cancel') {
            title = "Cancel Ongoing Quest?";
            message = "Are you sure you want to cancel this quest? The quest will be reset to 'open' status and all team assignments will be removed. This action cannot be undone.";
            confirmText = "Cancel Quest";
            confirmColor = red[600];
        }

        return confirmOpen ? (
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1500,
            }}>
                <Paper sx={{
                    width: 400,
                    p: 3,
                    borderRadius: 2,
                }}>
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        {message}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleCloseConfirm}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={() => handleAction(confirmAction === 'accept' ? 'accept' : 'decline')}
                            disabled={isProcessing}
                            sx={{ 
                                backgroundColor: confirmColor,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: confirmColor,
                                    filter: 'brightness(0.9)'
                                }
                            }}
                        >
                            {confirmText}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        ) : null;
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
                    disabled={isProcessing}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Confirmation Dialog */}
                {renderConfirmationDialog()}

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                    {/* Left side - Quest Information */}
                    <Box sx={{ flex: { md: 7 / 12 } }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {quest.questTitle}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
                            <Typography variant="body2" fontWeight="bold">
                                {status === "waiting"
                                    ? `Requested on: ${formatDate(quest.requestDate)}`
                                    : status === "in progress"
                                    ? `Started on: ${formatDate(quest.requestDate || quest.submitDate)}`
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
                        {status === "submitted" && (
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
                                                <AvatarProfile
                                                    src={member.avatar ? `/storage/${member.avatar}` : "/default-avatar.png"}
                                                    alt={member.name}
                                                    userId={member.user_id}
                                                    size={40}
                                                    frameSize={40}
                                                    tooltipText={`View ${member.name}'s profile`}
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

                            <Divider />

                            {/* Admin Actions */}
                            <Box sx={{ mt: 3 }}>
                                {renderAdminActions()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}