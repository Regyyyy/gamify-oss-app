import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Link } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuestCard from '@/Components/QuestCard';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import { useEffect } from 'react';

export default function BeginnerQuest() {
    const { quests, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        console.log("Received quests:", quests);
    }, [quests]);

    return (
        <MainLayout>
            <Head title="BeginnerQuest" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <LightbulbRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Beginner Quest
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Start your journey with us by taking these quests, leveling up, and unlock new challenges!
                                </Typography>
                            </Box>

                            {/* Project info */}
                            <Box sx={{ py: 2 }}>
                                <Typography sx={{ py: 1 }}>
                                    <InfoOutlinedIcon sx={{ mr: 1 }} />
                                    Project Info
                                </Typography>
                                <Typography>
                                    Project name: ASE Lab Game Dev Project 001
                                </Typography>
                                <Typography>
                                    Project repo:
                                    <Link href="https://github.com/F201/aselab-game-dev-open-project_001" underline="hover" sx={{ ml: 1 }}>click here</Link>
                                </Typography>
                            </Box>

                            {/* Quest List */}
                            <Box sx={{ py: 2 }}>
                                {quests.length > 0 ? (
                                    quests.map((quest) => {
                                        const requiredLevel = (quest.quest_id === 4 || quest.quest_id === 5) ? '2' : '1';
                                        return (
                                            <QuestCard
                                                key={quest.quest_id}
                                                questId={quest.quest_id}
                                                questTitle={quest.title}
                                                questDescription={quest.description}
                                                playerLevel={user.level.toString()}
                                                requiredLevel={requiredLevel}
                                                difficulty={quest.difficulty}
                                                xpReward={quest.xp_reward}
                                                role={quest.role ?? 'Any'}
                                                proficiencyReward={quest.proficiency_reward ?? 0}
                                                isCompleted={quest.is_completed}
                                                submissionImages={quest.submission_images}
                                                issueLink={quest.issue_link}
                                                questType="Beginner"
                                                currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                                status={quest.is_completed ? "finished" : "open"} // Set status based on completion
                                            />
                                        );
                                    })
                                ) : (
                                    <Typography>No beginner quests available.</Typography>
                                )}
                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
}