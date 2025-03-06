import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Chip, IconButton, Paper, Alert, Link } from "@mui/material";
import { blue, green, grey, orange, red, yellow, purple } from "@mui/material/colors";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "./PrimaryButton";
import TeamMemberSelection from "./TeamMemberSelection";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

export default function QuestModal({ open, onClose, quest, questType = "Beginner" }) {
  if (!quest) return null;

  const { url } = usePage();
  const isTakenQuestsPage = url.includes('/takenquests');

  const isUnlocked = quest.playerLevel >= quest.requiredLevel;
  const isAdvanced = questType === "Advanced";
  const submissionImages = quest.submissionImages || [];
  const teammates = quest.teammates || [];
  const status = quest.status || "open";
  // isTaken for Advanced quests uses the is_taken prop or status not being "open"
  // For Beginner quests, just use is_taken prop
  // For Beginner quests: isCompleted is determined by the isCompleted prop
  // For Advanced quests: isCompleted is determined by status === "finished"
  const isCompleted = isAdvanced ? (status === "finished") : quest.isCompleted;

  // Adjust status for Beginner quests
  const actualStatus = isAdvanced ? status : (isCompleted ? "finished" : "open");
  const isTaken = isAdvanced ? (quest.is_taken || actualStatus !== "open") : quest.is_taken;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    quest_id: quest.questId,
    images: [],
  });

  // Function to determine chip properties based on quest type and status
  const getStatusChip = () => {
    // For Beginner quests, only show "Unlocked"/"Locked" or "Finished"
    if (!isAdvanced) {
      if (isCompleted) {
        return {
          label: "Finished",
          icon: <CheckCircleIcon />,
          bgcolor: "transparent",
          border: `1px solid ${grey[700]}`,
          color: grey[800]
        };
      } else {
        return {
          label: isUnlocked ? "Unlocked" : "Locked",
          icon: isUnlocked ? <LockOpenRoundedIcon /> : <LockRoundedIcon />,
          bgcolor: isUnlocked ? green[200] : red[200],
          border: isUnlocked ? `1px solid ${green[800]}` : `1px solid ${red[800]}`,
          color: 'black'
        };
      }
    }

    // For Advanced quests, use the full range of statuses
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

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3 - selectedFiles.length);

      // Create preview URLs
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);

      // Update selected files
      const newSelectedFiles = [...selectedFiles, ...filesArray];
      setSelectedFiles(newSelectedFiles);

      // Update form data with the files
      setData('images', newSelectedFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up preview URL
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    // Update form data with the new files array
    setData('images', newFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit clicked with files:', selectedFiles);

    // Create FormData object for file uploads
    const formData = new FormData();
    formData.append('quest_id', quest.questId);

    // Append each file to the FormData with proper naming
    selectedFiles.forEach((file, index) => {
      formData.append(`images[]`, file);
      console.log(`Added file to FormData: images[]`, file.name);
    });

    // Log the FormData entries (for debugging)
    for (let [key, value] of formData.entries()) {
      console.log(`FormData contains: ${key} => ${value instanceof File ? value.name : value}`);
    }

    post(route('quest.submit'), formData, {
      forceFormData: true,
      onSuccess: () => {
        console.log('Submission successful');
        reset();
        setSelectedFiles([]);
        setPreviews([]);
        onClose();
        window.location.reload();
      },
      onError: (errors) => {
        console.error('Submission failed with errors:', errors);
      }
    });
  };

  // Render content for Beginner quests
  const renderBeginnerContent = () => {
    // If the quest is finished, show the submitted images
    if (isCompleted) {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Quest Finished
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You have already finished this quest. Here are your submitted screenshots:
          </Typography>

          {/* Display Submitted Images */}
          {submissionImages.length > 0 ? (
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
                  <PrimaryButton
                    variant="outlined"
                    fullWidth
                    onClick={() => window.open(`/storage/${image}`, '_blank')}
                    sx={{ mt: 1 }}
                  >
                    View Full Size
                  </PrimaryButton>
                </Paper>
              ))}
            </Box>
          ) : (
            <Alert severity="info" sx={{ my: 2 }}>
              No screenshots available for this submission.
            </Alert>
          )}
        </>
      );
    }

    // If not completed, show the submission form
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Submit Your Work
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload up to 3 screenshots of your work
        </Typography>

        {/* Error messages */}
        {(errors.images || errors.quest_id) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.images || errors.quest_id}
          </Alert>
        )}

        {/* File Upload Section */}
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            multiple
            id="upload-images"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={!isUnlocked || selectedFiles.length >= 3 || processing}
          />
          <label htmlFor="upload-images">
            <PrimaryButton
              variant="contained"
              component="span"
              startIcon={<UploadFileIcon />}
              disabled={!isUnlocked || selectedFiles.length >= 3 || processing}
              fullWidth
              sx={{ mb: 2 }}
            >
              {selectedFiles.length >= 3 ? "Maximum files reached" : "Upload Images"}
            </PrimaryButton>
          </label>

          {/* Image Previews */}
          {previews.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
              {previews.map((preview, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                    <Typography variant="body2" noWrap>
                      {selectedFiles[index]?.name || `Image ${index + 1}`}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => removeFile(index)}
                    disabled={processing}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* Submit button */}
        <PrimaryButton
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isUnlocked || selectedFiles.length === 0 || processing}
          onClick={handleSubmit}
        >
          Submit Quest
        </PrimaryButton>
      </>
    );
  };

  // Render advanced quest content
  const renderAdvancedContent = () => {
    // For finished quests
    if (actualStatus === "finished") {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Quest Finished
          </Typography>

          {/* Team information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
              Team Members
            </Typography>

            {teammates.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

          <Typography variant="body2" color="text.secondary" gutterBottom>
            This quest is finished.
          </Typography>

          {/* Display Submitted Images */}
          {submissionImages.length > 0 ? (
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
                  <PrimaryButton
                    variant="outlined"
                    fullWidth
                    onClick={() => window.open(`/storage/${image}`, '_blank')}
                    sx={{ mt: 1 }}
                  >
                    View Full Size
                  </PrimaryButton>
                </Paper>
              ))}
            </Box>
          ) : (
            <></>
          )}
        </>
      );
    }

    // For submitted quests (under review)
    if (actualStatus === "submitted") {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Quest Under Review
          </Typography>

          {/* Team information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
              Team Members
            </Typography>

            {teammates.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

          {/* Submission Images */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Submitted Work
            </Typography>

            {submissionImages.length > 0 ? (
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
                    <PrimaryButton
                      variant="outlined"
                      fullWidth
                      onClick={() => window.open(`/storage/${image}`, '_blank')}
                      sx={{ mt: 1 }}
                    >
                      View Full Size
                    </PrimaryButton>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Alert severity="info" sx={{ my: 2 }}>
                No submission images available.
              </Alert>
            )}
          </Box>

          <Alert severity="info">
            Your submission is currently being reviewed by an administrator.
          </Alert>
        </>
      );
    }

    // For quests in progress (can submit)
    if (actualStatus === "in progress") {

      // If not in taken quest then its a teammates
      const isTeamMember = !isTakenQuestsPage;

      return (
        <>
          <Typography variant="h6" gutterBottom>
            Quest In Progress
          </Typography>

          {/* Team information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
              Team Members
            </Typography>

            {teammates.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

          {/* Submission form */}
          {isTeamMember ? (
            <>
              <Typography variant="h6" gutterBottom>
                Submit Your Work
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Upload up to 3 screenshots of your work
              </Typography>

              {/* Error messages */}
              {(errors.images || errors.quest_id) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.images || errors.quest_id}
                </Alert>
              )}

              {/* File Upload Section */}
              <Box sx={{ mb: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="upload-images"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={selectedFiles.length >= 3 || processing}
                />
                <label htmlFor="upload-images">
                  <PrimaryButton
                    variant="contained"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    disabled={selectedFiles.length >= 3 || processing}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {selectedFiles.length >= 3 ? "Maximum files reached" : "Upload Images"}
                  </PrimaryButton>
                </label>

                {/* Image Previews */}
                {previews.length > 0 && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    {previews.map((preview, index) => (
                      <Paper
                        key={index}
                        elevation={2}
                        sx={{
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <img
                            src={preview}
                            alt={`Preview ${index}`}
                            style={{ width: 50, height: 50, objectFit: "cover" }}
                          />
                          <Typography variant="body2" noWrap>
                            {selectedFiles[index]?.name || `Image ${index + 1}`}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => removeFile(index)}
                          disabled={processing}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Submit button */}
              <PrimaryButton
                variant="contained"
                color="primary"
                fullWidth
                disabled={selectedFiles.length === 0 || processing}
                onClick={handleSubmit}
              >
                Submit Quest
              </PrimaryButton>
            </>
          ) : (
            <></>
          )}
        </>
      );
    }

    // For waiting quests
    if (actualStatus === "waiting") {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Quest Awaiting Approval
          </Typography>

          {/* Team information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
              Team Members
            </Typography>

            {teammates.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

          <Alert severity="info">
            This quest request is currently awaiting admin approval.
          </Alert>
        </>
      );
    }

    // For open/untaken quests - show team selection
    if (actualStatus === "open" && !isTaken) {
      return <TeamMemberSelection quest={quest} onClose={onClose} isUnlocked={isUnlocked} />;
    }

    // Default fallback
    return (
      <Alert severity="warning">
        Unknown quest status: {actualStatus}
      </Alert>
    );
  };

  // Main render method - uses the questType to determine which content to render
  const renderRightSideContent = () => {
    if (isAdvanced) {
      return renderAdvancedContent();
    } else {
      return renderBeginnerContent();
    }
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
              {!isAdvanced && actualStatus === "open" && !isCompleted && !isTaken && (
                <Typography variant="body2" fontWeight="bold">
                  {`Required Level: ${quest.requiredLevel}`}
                </Typography>
              )}
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
          </Box>

          {/* Right side - Dynamic content based on quest status and type */}
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

              <Box>
                {renderRightSideContent()}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}