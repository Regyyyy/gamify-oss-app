import React from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function InfoModal({ open, onClose }) {
  const theme = useTheme();
  
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
          pt: { xs: 4, sm: 5 },
          borderRadius: 2,
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h4" component="h1" fontWeight="bold" align="center" gutterBottom>
          How to Use ASE Gamify-OSS
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Welcome section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Welcome to ASE Gamify-OSS!
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to our gamified open-source contribution platform! We've designed this platform to make the process of contributing to open-source projects more engaging and fun. Your contributions are incredibly valuable to our community, and we want to recognize and reward your efforts.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're a beginner or an experienced contributor, there's something here for everyone. We hope you enjoy your journey with us and have a great time making meaningful contributions to the project!
          </Typography>
        </Box>

        {/* Beginner Quests section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Start Your Journey with Beginner Quests!
          </Typography>
          <Typography variant="body1" paragraph>
            If you're new to our platform or open-source contributions in general, Beginner Quests are the perfect place to start! These quests are designed to help you understand the project structure, get familiar with GitHub workflows, and make your first contributions.
          </Typography>
          <Typography variant="body1" paragraph>
            By completing Beginner Quests, you'll earn XP points that will help you level up. Once you reach Level 3, you'll unlock more challenging and rewarding quests! Head over to the Beginner Quests page to get started on your adventure.
          </Typography>
        </Box>

        {/* Advanced Quests section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Contribute to Community with Advanced Quests!
          </Typography>
          <Typography variant="body1" paragraph>
            Once you reach Level 3, you'll unlock Advanced Quests on the Quest Board! These quests offer more complex challenges that contribute significantly to the project. For particularly challenging quests marked as "Hard," you'll need to reach Level 4.
          </Typography>
          <Typography variant="body1" paragraph>
            Advanced Quests allow you to team up with other contributors, specialize in different roles (Game Designer, Game Artist, Game Programmer, or Audio Composer), and earn both XP and role-specific Proficiency points. The more quests you complete, the higher your level and proficiency!
          </Typography>
        </Box>

        {/* Rewards section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Get Rewards!
          </Typography>
          <Typography variant="body1" paragraph>
            Your contributions won't go unnoticed! As you progress through quests and participate in the community, you'll unlock various rewards:
          </Typography>
          <Typography variant="body1" paragraph>
            • <strong>Achievements:</strong> Complete specific milestones to earn achievements, which grant XP bonuses and exclusive avatar frames to customize your profile.
          </Typography>
          <Typography variant="body1" paragraph>
            • <strong>Badges:</strong> These special recognitions are awarded for outstanding contributions to the project repository and community. Admins will award badges based on your activities.
          </Typography>
          <Typography variant="body1" paragraph>
            Check out the Achievements and Badges pages to see all available rewards and track your progress!
          </Typography>
        </Box>

        {/* Leaderboard section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Climb the Leaderboard!
          </Typography>
          <Typography variant="body1" paragraph>
            See how your contributions stack up against others in the community! The Leaderboard showcases all contributors ranked by their XP points, giving you a clear view of your progress and the community's overall activity.
          </Typography>
          <Typography variant="body1" paragraph>
            The top contributors may even unlock special rewards like exclusive avatar frames! Will you make it to the top spots? Visit the Leaderboard page to find out where you stand and who you're competing with!
          </Typography>
        </Box>

        {/* Profile section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Customize your Profile!
          </Typography>
          <Typography variant="body1" paragraph>
            Make your presence known in the community by customizing your profile! Upload a personalized avatar and showcase your achievements with special avatar frames earned through completing achievements.
          </Typography>
          <Typography variant="body1" paragraph>
            Your profile also displays your level, XP progress, acquired badges, and role proficiencies. It's a complete overview of your journey and contributions to the project. Visit your Profile or Settings to customize your appearance!
          </Typography>
        </Box>

        {/* Final section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Have Fun!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you again for being part of our open-source community! Remember that every contribution matters, no matter how small. Don't be shy about submitting pull requests, creating issues, or offering feedback. Your perspective and work are valuable to us.
          </Typography>
          <Typography variant="body1" paragraph>
            Our goal is to make open-source contribution an enjoyable and rewarding experience. So dive in, explore the platform, level up, and most importantly, have fun while making a positive impact on the project!
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}