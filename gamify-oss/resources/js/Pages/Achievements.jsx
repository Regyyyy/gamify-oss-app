import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AchievementCard from '@/Components/AchievementCard';
import { useState } from 'react';

export default function Achievements() {
    const { userAchievements } = usePage().props;
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    const handleClaimReward = (achievementId) => {
        // Call the backend API to claim the reward
        window.axios.post(route('achievements.claim'), {
            achievement_id: achievementId
        })
            .then(response => {
                setAlert({
                    open: true,
                    message: 'Achievement claimed successfully!',
                    severity: 'success'
                });
                // Refresh the page to show updated status
                window.location.reload();
            })
            .catch(error => {
                setAlert({
                    open: true,
                    message: error.response?.data?.error || 'Failed to claim achievement',
                    severity: 'error'
                });
            });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <MainLayout>
            <Head title="Achievements" />
            <Box>
                <div className="overflow-hidden">
                    <Box className="p-10 text-gray-900">
                        {/* Head */}
                        <Box>
                            <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                                <StarRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                Achievements
                            </Typography>
                        </Box>
                        <Box sx={{ py: 1 }}>
                            <Typography>
                                Get more rewards and exclusive items by getting achievements!
                            </Typography>
                        </Box>

                        {/* Achievements List */}
                        <Box>
                            {userAchievements && userAchievements.map((achievement) => (
                                <AchievementCard
                                    key={achievement.id}
                                    achievementName={achievement.name}
                                    achievementDescription={achievement.description}
                                    xpReward={achievement.xp_reward}
                                    extraReward={achievement.extra_reward}
                                    extraRewardName={achievement.avatar_frame_name}
                                    isCompleted={achievement.is_completed}
                                    isClaimed={achievement.is_claimed}
                                    onClaimReward={() => handleClaimReward(achievement.id)}
                                />
                            ))}
                        </Box>
                    </Box>
                </div>
            </Box>

            {/* Alert Snackbar */}
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    variant="filled"
                    elevation={6}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
}