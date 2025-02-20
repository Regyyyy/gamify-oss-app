import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AchievementCard from '@/Components/AchievementCard';

export default function Achievements() {
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
                            <AchievementCard
                                achievementName="Rookie Adventurer Walks the Path of Legends"
                                achievementDescription="Complete all beginner quests"
                                xpReward={200}
                                extraReward={true}
                                isCompleted={true}
                                isClaimed={false}
                            />
                            <AchievementCard
                                achievementName="Boundless Potential Begins to Unfold"
                                achievementDescription="Reach level 5"
                                xpReward={500}
                                extraReward={false}
                                isCompleted={true}
                                isClaimed={true}
                            />
                            <AchievementCard
                                achievementName="A Guiding Hand Lifts the Community"
                                achievementDescription="Give comments to 5 GitHub issues"
                                xpReward={300}
                                extraReward={false}
                                isCompleted={false}
                                isClaimed={false}
                            />
                            <AchievementCard
                                achievementName="A Warrior Accepts the Ultimate Trial"
                                achievementDescription="Take your first hard quest"
                                xpReward={400}
                                extraReward={true}
                                isCompleted={true}
                                isClaimed={false}
                            />
                            <AchievementCard
                                achievementName="The Hunt for Errors Never Ends"
                                achievementDescription="Post an issue about a problem you found in the project or while contributing"
                                xpReward={350}
                                extraReward={false}
                                isCompleted={false}
                                isClaimed={false}
                            />
                        </Box>
                    </Box>
                </div>
            </Box>
        </MainLayout>
    );
}
