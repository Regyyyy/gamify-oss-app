import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SettingsLayout from '@/Layouts/SettingsLayout';
import { 
    Box, 
    Typography, 
    Paper, 
    Avatar, 
    Grid2, 
    LinearProgress, 
    Chip,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import PrimaryButton from '@/Components/PrimaryButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import { green, blue, orange, purple } from '@mui/material/colors';
import MainLayout from '@/Layouts/MainLayout';

export default function Profile({ profileUser, achievements, badges, proficiencies, isOwnProfile }) {
    // XP Progress calculation
    const calculateXpProgress = () => {
        // Level thresholds
        const levelThresholds = {
            1: 0,
            2: 200,
            3: 450,
            4: 750,
            5: 1100,
            6: 1500,
            7: 1950,
            8: 2450,
            9: 3050,
            10: 3650
        };

        // If at max level, show 100%
        if (profileUser.level >= 10) {
            return 100;
        }

        // Get XP thresholds for current and next level
        const nextLevel = profileUser.level + 1;
        const xpForCurrentLevel = levelThresholds[profileUser.level];
        const xpForNextLevel = levelThresholds[nextLevel];

        // Calculate progress percentage
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;
        const xpProgress = profileUser.xp_point - xpForCurrentLevel;

        return Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));
    };

    // Color based on proficiency value
    const getProficiencyColor = (percentage) => {
        if (percentage < 25) return green[600];
        if (percentage < 50) return blue[600];
        if (percentage < 75) return orange[600];
        return purple[600];
    };

    return (
        <SettingsLayout>
            <Head title={`Profile - ${profileUser.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <Paper className="bg-white p-6 shadow sm:rounded-lg">
                        {/* First Row: User Info and Proficiencies */}
                        <Grid2 container spacing={4}>
                            {/* User Information Section */}
                            <Grid2 item xs={12} md={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                    {/* Profile Picture with Frame */}
                                    <Box sx={{ position: 'relative', width: 180, height: 180, mb: 2 }}>
                                        <Avatar
                                            src={profileUser.avatar}
                                            alt={profileUser.name}
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 1
                                            }}
                                        />
                                        <img
                                            src={profileUser.avatar_frame_path}
                                            alt="Avatar Frame"
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                top: 0,
                                                left: 0,
                                                zIndex: 2
                                            }}
                                        />
                                    </Box>

                                    {/* Username */}
                                    <Typography variant="h5" fontWeight="bold" align="center">
                                        {profileUser.name}
                                    </Typography>

                                    {/* Role Badge */}
                                    <Chip 
                                        label={profileUser.role === 'admin' ? 'Administrator' : 'Member'} 
                                        color={profileUser.role === 'admin' ? 'primary' : 'default'} 
                                        size="small" 
                                        sx={{ mt: 1, mb: 2 }}
                                    />

                                    {/* Level and XP */}
                                    <Box sx={{ width: '100%', mt: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                Level {profileUser.level}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {profileUser.xp_point} XP
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={calculateXpProgress()} 
                                            sx={{ 
                                                height: 8, 
                                                borderRadius: 4,
                                                mb: 0.5
                                            }} 
                                        />
                                        <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block' }}>
                                            {profileUser.level < 10 ? `Progress to Level ${profileUser.level + 1}` : 'Max Level'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid2>

                            {/* Proficiencies Section */}
                            <Grid2 item xs={12} md={8}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Proficiencies
                                </Typography>
                                <Grid2 container spacing={2}>
                                    {proficiencies.map((proficiency) => (
                                        <Grid2 item xs={12} sm={6} key={proficiency.id}>
                                            <Card elevation={2} sx={{ height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        {proficiency.name}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {proficiency.points} / {proficiency.max_points}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold" sx={{ color: getProficiencyColor(proficiency.percentage) }}>
                                                            {Math.round(proficiency.percentage)}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={proficiency.percentage} 
                                                        sx={{ 
                                                            height: 8, 
                                                            borderRadius: 4,
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: getProficiencyColor(proficiency.percentage)
                                                            }
                                                        }} 
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid2>
                                    ))}
                                </Grid2>
                            </Grid2>
                        </Grid2>

                        <Divider sx={{ my: 4 }} />

                        {/* Second Row: Achievements and Badges */}
                        <Grid2 container spacing={4}>
                            {/* Achievements Section */}
                            <Grid2 item xs={12} md={4}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    height: '100%'
                                }}>
                                    <StarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {achievements.count} / {achievements.total}
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Achievements Completed
                                    </Typography>
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={achievements.percentage} 
                                            sx={{ 
                                                height: 8, 
                                                borderRadius: 4,
                                            }} 
                                        />
                                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                            {achievements.percentage}% Complete
                                        </Typography>
                                    </Box>
                                    <Link href="/achievements" style={{ marginTop: 'auto' }}>
                                        <PrimaryButton>
                                            View All Achievements
                                        </PrimaryButton>
                                    </Link>
                                </Box>
                            </Grid2>

                            {/* Badges Section */}
                            <Grid2 item xs={12} md={8}>
                                <Box sx={{ height: '100%' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmojiEventsIcon sx={{ mr: 1 }} />
                                        Badges Earned
                                    </Typography>

                                    {badges.length > 0 ? (
                                        <Grid2 container spacing={2} sx={{ mt: 1 }}>
                                            {badges.map((badge) => (
                                                <Grid2 item xs={6} sm={4} md={3} key={badge.id}>
                                                    <Box sx={{ 
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        p: 2,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        height: '100%',
                                                        '&:hover': {
                                                            boxShadow: 3,
                                                            transform: 'translateY(-4px)',
                                                            transition: 'all 0.2s'
                                                        }
                                                    }}>
                                                        <img 
                                                            src={badge.image_path} 
                                                            alt={badge.name}
                                                            style={{ 
                                                                width: 80, 
                                                                height: 80, 
                                                                objectFit: 'contain',
                                                                marginBottom: 8
                                                            }}
                                                        />
                                                        <Typography variant="body2" fontWeight="bold" align="center">
                                                            {badge.name}
                                                        </Typography>
                                                    </Box>
                                                </Grid2>
                                            ))}
                                        </Grid2>
                                    ) : (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            height: '70%',
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            p: 3
                                        }}>
                                            <Typography variant="body1" color="text.secondary" align="center">
                                                No badges earned yet. Complete activities in the project to earn badges!
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Link href="/badges">
                                            <PrimaryButton>
                                                View All Badges
                                            </PrimaryButton>
                                        </Link>
                                    </Box>
                                </Box>
                            </Grid2>
                        </Grid2>

                        {/* Edit Profile Button (Only for own profile) */}
                        {isOwnProfile && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                                <Link href={route('profile.edit')}>
                                    <PrimaryButton startIcon={<EditIcon />}>
                                        Edit Profile
                                    </PrimaryButton>
                                </Link>
                            </Box>
                        )}
                    </Paper>
                </div>
            </div>
        </SettingsLayout>
    );
}