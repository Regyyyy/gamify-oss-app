import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Avatar, 
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import PrimaryButton from './PrimaryButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useForm, usePage } from '@inertiajs/react';
import LockIcon from '@mui/icons-material/Lock';

export default function TeamMemberSelection({ quest, onClose, isUnlocked = false }) {
  const { auth } = usePage().props;
  const isAdmin = auth.user.role === 'admin';
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteProcessing, setDeleteProcessing] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    quest_id: quest.questId,
    team_members: [],
  });

  useEffect(() => {
    const fetchEligibleUsers = async () => {
      try {
        const response = await axios.post(route('quests.eligible-users'), {
          quest_id: quest.questId
        });
        setEligibleUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching eligible users:', error);
        setLoading(false);
      }
    };

    fetchEligibleUsers();
  }, [quest.questId]);

  const handleTeamChange = (index, userId) => {
    // Create a new array to avoid modifying state directly
    const newTeam = [...selectedTeam];
    
    // If userId is -1, it means "None" was selected
    if (userId === -1) {
      if (index < newTeam.length) {
        newTeam.splice(index, 1); // Remove the selection at this index
      }
    } else {
      // If the index is beyond current team size, push the new value
      if (index >= newTeam.length) {
        newTeam.push(userId);
      } else {
        // Replace the value at this index
        newTeam[index] = userId;
      }
    }
    
    // Update local state
    setSelectedTeam(newTeam);
    
    // Update form data
    setData('team_members', newTeam);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('quests.take'), {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // Handle delete quest button click
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setDeleteProcessing(true);
    try {
      const response = await axios.delete(route('quests.delete'), {
        data: { quest_id: quest.questId }
      });
      
      // Close the modal and redirect to quest board
      onClose();
      window.location.href = route('questboard');
    } catch (error) {
      console.error('Error deleting quest:', error);
      // You might want to show an error message here
    } finally {
      setDeleteProcessing(false);
      setDeleteDialogOpen(false);
    }
  };

  // Exclude already selected users from options
  const getAvailableUsers = (currentIndex) => {
    return eligibleUsers.filter(user => 
      !selectedTeam.includes(user.user_id) || 
      (currentIndex < selectedTeam.length && selectedTeam[currentIndex] === user.user_id)
    );
  };

  // Generate team member dropdowns (max 4 additional members)
  const renderTeamMemberSelections = () => {
    // Maximum 4 additional team members
    const maxTeamSize = 4;
    const selections = [];

    // Add selections up to the current team size + 1 (to allow adding one more)
    // but not exceeding maxTeamSize
    const displayCount = Math.min(selectedTeam.length + 1, maxTeamSize);

    for (let i = 0; i < displayCount; i++) {
      const availableUsers = getAvailableUsers(i);
      
      selections.push(
        <FormControl fullWidth key={`team-member-${i}`} sx={{ mb: 2 }}>
          <InputLabel id={`team-member-label-${i}`}>
            {i === 0 ? "Add Team Member (Optional)" : "Add Another Team Member"}
          </InputLabel>
          <Select
            labelId={`team-member-label-${i}`}
            value={i < selectedTeam.length ? selectedTeam[i] : -1}
            onChange={(e) => handleTeamChange(i, e.target.value)}
            label={i === 0 ? "Add Team Member (Optional)" : "Add Another Team Member"}
            disabled={processing || availableUsers.length === 0}
          >
            <MenuItem value={-1}>
              <em>None</em>
            </MenuItem>
            {availableUsers.map(user => (
              <MenuItem key={user.user_id} value={user.user_id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar 
                    src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'} 
                    sx={{ width: 24, height: 24 }}
                  />
                  <Box sx={{ ml: 1 }}>
                    {user.name}
                    <Chip 
                      label={`Level ${user.level}`} 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return selections;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If quest is locked, show locked UI
  if (!isUnlocked) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Team Selection
        </Typography>
        
        <Alert 
          severity="error" 
          icon={<LockIcon />}
          sx={{ mb: 3 }}
        >
          This quest is locked. You need to reach level {quest.requiredLevel} to take this quest.
        </Alert>

        <Box sx={{ my: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Continue leveling up by completing beginner quests to unlock advanced quests.
          </Typography>
        </Box>
        
        <PrimaryButton
          variant="contained"
          color="primary"
          fullWidth
          disabled={true}
        >
          Quest Locked
        </PrimaryButton>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Team Selection
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You can take this quest alone or invite up to 4 teammates to work on it together.
          Only users who meet the level requirement can be selected.
        </Typography>
      </Box>

      {eligibleUsers.length === 0 ? (
        <Box sx={{ my: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            No eligible teammates are available. You can still take this quest solo.
          </Typography>
        </Box>
      ) : (
        renderTeamMemberSelections()
      )}

      {errors.team_members && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {errors.team_members}
        </Typography>
      )}

      <PrimaryButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={processing}
      >
        {selectedTeam.length > 0 
          ? `Take Quest with Team (${selectedTeam.length + 1} members)` 
          : "Take Quest Solo"}
      </PrimaryButton>

      {/* Delete Button for Admin (only shown to admins) */}
      {isAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton 
            color="error" 
            onClick={handleDeleteClick}
            disabled={processing || deleteProcessing}
            size="small"
            sx={{ 
              bgcolor: 'rgba(211, 47, 47, 0.1)', 
              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } 
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Quest?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this quest? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <PrimaryButton 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleteProcessing}
            sx={{ bgcolor: 'grey.500' }}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton 
            onClick={handleDeleteConfirm} 
            disabled={deleteProcessing}
            sx={{ bgcolor: 'error.main' }}
          >
            Delete Quest
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}