import React, { useState } from "react";
import { Modal, Box, Typography, Chip, Button, IconButton, Paper, Alert, Link } from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "./PrimaryButton";

export default function QuestModal({ open, onClose, quest }) {
  if (!quest) return null;

  const isUnlocked = quest.playerLevel >= quest.requiredLevel;
  const isCompleted = quest.isCompleted || false;
  const submissionImages = quest.submissionImages || [];

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    quest_id: quest.questId,
    images: [],
  });

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

    // Create FormData object for file uploads
    const formData = new FormData();
    formData.append('quest_id', quest.questId);

    // Append each file to the FormData with proper naming
    selectedFiles.forEach((file, index) => {
      formData.append(`images[]`, file);
    });

    post(route('quest.submit'), formData, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setSelectedFiles([]);
        setPreviews([]);
        onClose();
      },
    });
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
          position: "relative" // For positioning the close button
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
          {/* Left side */}
          <Box sx={{ flex: { md: 7 / 12 } }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {quest.questTitle}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              {isCompleted ? (
                <Chip
                  label="Completed"
                  sx={{
                    bgcolor: "transparent",
                    border: `1px solid ${grey[700]}`,
                    fontWeight: "bold",
                    color: grey[800],
                  }}
                />
              ) : (
                <Chip
                  label={isUnlocked ? "Unlocked" : "Locked"}
                  icon={isUnlocked ? <LockOpenRoundedIcon /> : <LockRoundedIcon />}
                  sx={{
                    bgcolor: isUnlocked ? green[200] : red[200],
                    border: `1px solid ${isUnlocked ? green[800] : red[800]}`,
                    fontWeight: "bold",
                    color: "black",
                  }}
                />
              )}
              <Typography variant="body2" fontWeight="bold">
                {isCompleted ? "Completed" : `Required Level: ${quest.requiredLevel}`}
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
                  <strong>Read More</strong>
                  <Link
                    href={quest.issue_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      wordBreak: 'break-word',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    {quest.issue_link}
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right side */}
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
                {isCompleted ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Quest Completed
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      You have already completed this quest. Here are your submitted screenshots:
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
                ) : (
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
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}