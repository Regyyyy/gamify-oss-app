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
    Divider,
    Card,
    CardContent,
    Button
} from '@mui/material';
import PrimaryButton from '@/Components/PrimaryButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useTheme } from '@mui/material/styles';

export default function Profile({ profileUser, achievements, badges, proficiencies, isOwnProfile }) {
    const theme = useTheme();

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

    // Filter proficiencies to only show those with points > 0
    const userProficiencies = proficiencies.filter(proficiency => proficiency.points > 0);

    return (
        <SettingsLayout>
            <Head title={`Profile - ${profileUser.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Back to Quest Board link*/}
                    <Box sx={{ mb: 2 }}>
                        <Link 
                            href={route('questboard')} 
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    color: 'text.secondary',
                                    '&:hover': { 
                                        color: theme.palette.primary.main,
                                    },
                                    transition: 'color 0.2s'
                                }}
                            >
                                <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Back to Quest Board
                            </Typography>
                        </Link>
                    </Box>

                    <Paper className="bg-white p-6 shadow sm:rounded-lg">
                        {/* First Row: User Info - Horizontal Layout */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3, alignItems: 'center' }}>
                            {/* Profile Picture with Frame */}
                            <Box sx={{ position: 'relative', width: 250, height: 250, mr: 3 }}>
                                <Avatar
                                    src={profileUser.avatar}
                                    alt={profileUser.name}
                                    sx={{
                                        width: 200,
                                        height: 200,
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

                            {/* User info section */}
                            <Box sx={{ flexGrow: 1 }}>
                                {/* Username and Email */}
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        {profileUser.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profileUser.email}
                                    </Typography>
                                </Box>

                                {/* Level and XP */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="body1" fontWeight="bold" sx={{ mr: 1, color: theme.palette.primary.light }}>
                                        {profileUser.level >= 10 ? `Level ${profileUser.level} (MAX)` : `Level ${profileUser.level}`}
                                    </Typography>
                                    {isOwnProfile && (
                                        <Typography variant="body2" color="text.secondary">
                                            {profileUser.xp_point} XP
                                        </Typography>
                                    )}
                                </Box>

                                {/* XP Progress Bar (only shown for own profile) */}
                                {isOwnProfile && (
                                    <Box sx={{
                                        width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
                                        maxWidth: '400px',
                                        mr: 4
                                    }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={calculateXpProgress()}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                mb: 0.5
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Proficiencies Section - Horizontal Layout */}
                        {userProficiencies.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }} gutterBottom>
                                    <WorkspacePremiumIcon sx={{ mr: 1 }} />
                                    Proficiencies
                                </Typography>
                                <Grid2 container spacing={2}>
                                    {userProficiencies.map((proficiency) => (
                                        <Grid2 item xs={12} sm={6} md={3} lg={3} key={proficiency.id}>
                                            <Card elevation={2} sx={{
                                                width: 200,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                <CardContent sx={{
                                                    flexGrow: 1,
                                                    pb: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        {proficiency.name}
                                                    </Typography>

                                                    <Box sx={{ mt: 'auto' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                            {proficiency.percentage >= 100 ? (
                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                                    <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                                                                        MAX
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {proficiency.points} / {proficiency.max_points}
                                                                    </Typography>
                                                                    <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                                                                        {`${Math.round(proficiency.percentage)}%`}
                                                                    </Typography>
                                                                </>
                                                            )}
                                                        </Box>

                                                        <Box sx={{
                                                            width: '100%'
                                                        }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={proficiency.percentage}
                                                                color="primary"
                                                                sx={{
                                                                    height: 8,
                                                                    borderRadius: 4
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid2>
                                    ))}
                                </Grid2>
                            </Box>
                        )}

                        {userProficiencies.length === 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }} gutterBottom>
                                    <WorkspacePremiumIcon sx={{ mr: 1 }} />
                                    Proficiencies
                                </Typography>
                                <Box sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No proficiencies earned yet. Complete quests with specific roles to earn proficiency points!
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ my: 4 }} />

                        {/* Achievements & Badges Section Header */}
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <EmojiEventsIcon sx={{ mr: 1 }} />
                            Achievements & Badges
                        </Typography>

                        {/* Achievements and Badges Content */}
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

                                    {/* Removed progress bar and percentage */}

                                    <Box sx={{ mt: 'auto' }}>
                                        <Link href="/achievements">
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    borderColor: theme.palette.primary.main,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.light + '20',
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }}
                                            >
                                                View All Achievements
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                            </Grid2>

                            {/* Badges Section */}
                            <Grid2 item xs={12} md={8}>
                                <Box sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>
                                    {badges.length > 0 ? (
                                        <Grid2 container spacing={2}>
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
                                            p: 3
                                        }}>
                                            <Typography variant="body1" color="text.secondary" align="center">
                                                No badges earned yet. Complete activities in the project to earn badges!
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Link href="/badges">
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    borderColor: theme.palette.primary.main,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.light + '20',
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }}
                                            >
                                                View All Badges
                                            </Button>
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