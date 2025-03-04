import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Link, Button } from '@mui/material';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuestCard from '@/Components/QuestCard';
import GroupIcon from '@mui/icons-material/Group';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';

export default function TakenQuests() {
    const { quests, auth } = usePage().props;
    const user = auth.user;
    
    return (
        <MainLayout>
            <Head title="Taken Quests" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <FlagRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Taken Quests
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Check out quests that have been taken by other community members. See who's working on what!
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
                                {quests && quests.length > 0 ? (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            Quests Currently In Progress By Others
                                        </Typography>
                                        
                                        {quests.map((quest) => (
                                            <Box key={quest.quest_id} sx={{ mb: 3 }}>
                                                <QuestCard
                                                    questId={quest.quest_id}
                                                    questTitle={quest.title}
                                                    questDescription={quest.description}
                                                    playerLevel={user.level.toString()}
                                                    requiredLevel={quest.required_level || 
                                                        (quest.difficulty === "Hard" ? 4 : quest.difficulty === "Medium" ? 3 : 2)}
                                                    difficulty={quest.difficulty}
                                                    xpReward={quest.xp_reward}
                                                    role={quest.role ?? 'Any'}
                                                    proficiencyReward={quest.proficiency_reward ?? 0}
                                                    isCompleted={quest.is_completed || false}
                                                    isTaken={true} // These are all taken quests
                                                    submissionImages={quest.submission_images || []}
                                                    issueLink={quest.issue_link}
                                                    teammates={quest.teammates || []}
                                                    questType="Advanced"
                                                    currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                                />
                                            </Box>
                                        ))}
                                    </>
                                ) : (
                                    <Box sx={{ 
                                        p: 4, 
                                        border: '1px dashed #ccc', 
                                        borderRadius: 2, 
                                        textAlign: 'center' 
                                    }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No quests are currently being worked on by other users.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
}