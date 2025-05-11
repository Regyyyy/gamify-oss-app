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
import PrimaryButton from '@/Components/PrimaryButton';

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
                                <Box sx={{ mt: 1 }}>
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        Project repo:
                                        <PrimaryButton
                                            href="https://github.com/F201/aselab-game-dev-open-project_001"
                                            target="_blank"
                                            size="small"
                                            sx={{ ml: 1, px: 2, py: 0.5 }}
                                            startIcon={
                                                <img
                                                    src="/images/github-mark-white.png"
                                                    alt="GitHub"
                                                    style={{ width: 16, height: 16 }}
                                                />
                                            }
                                        >
                                            Open Project
                                        </PrimaryButton>
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Quest List */}
                            <Box sx={{ py: 2 }}>
                                {quests && quests.length > 0 ? (
                                    <>
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
                                                    isCompleted={quest.status === 'finished'}
                                                    isTaken={true} // These are all taken quests
                                                    submissionImages={quest.submission_images || []}
                                                    issueLink={quest.issue_link}
                                                    teammates={quest.teammates || []}
                                                    questType="Advanced"
                                                    currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                                    status={quest.status}
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