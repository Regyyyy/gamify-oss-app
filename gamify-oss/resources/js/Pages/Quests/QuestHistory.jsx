import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Link, Divider, Alert } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuestCard from '@/Components/QuestCard';
import { useEffect } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function QuestHistory() {
    const { finishedQuests, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        // Log finished quests for debugging
        if (finishedQuests) {
            console.log("Finished quests:", finishedQuests);
        }
    }, [finishedQuests]);

    return (
        <MainLayout>
            <Head title="Quest History" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <HistoryRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Quest History
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Revisit the quests you've finished, whether by your own skill or alongside fellow contributors!
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


                            {/* Quest History Section */}
                            <Box sx={{ py: 2 }}>
                                {finishedQuests && finishedQuests.length > 0 ? (
                                    finishedQuests.map((quest) => (
                                        <QuestCard
                                            key={`history-${quest.quest_id}`}
                                            questId={quest.quest_id}
                                            questTitle={quest.title}
                                            questDescription={quest.description}
                                            playerLevel={user.level.toString()}
                                            requiredLevel={quest.difficulty === "Hard" ? 4 : 3}
                                            difficulty={quest.difficulty}
                                            xpReward={quest.xp_reward}
                                            role={quest.role ?? 'Any'}
                                            proficiencyReward={quest.proficiency_reward ?? 0}
                                            isCompleted={true}
                                            isTaken={true}
                                            submissionImages={quest.submission_images || []}
                                            issueLink={quest.issue_link}
                                            teammates={quest.teammates || []}
                                            questType={quest.type}
                                            currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                            status="finished"
                                        />
                                    ))
                                ) : (
                                    <Box sx={{
                                        p: 4,
                                        border: '1px dashed #ccc',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                    }}>
                                        <Typography variant="body1" color="text.secondary">
                                            You haven't completed any advanced quests yet. Take quests from the Quest Board and complete them to see your history here.
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <SecondaryButton
                                                href="/questboard"
                                            >
                                                Find Available Quests
                                            </SecondaryButton>
                                        </Box>
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